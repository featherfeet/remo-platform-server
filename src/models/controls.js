/*
import SendChat from '../components/layout/chat/sendChat';
Controls are assigned to a channel, and not tied to a specific robot
Multiple channels on a robot_server can load the same control set & feed it to different robots
Right now this only covers buttons, will will eventually include other types of input
*/
const { makeId, createTimeStamp } = require("../modules/utilities");

const { logger } = require("../modules/logging");
const log = (message) => {
  logger({
    message: message,
    level: "debug",
    source: "models/controls.js",
  });
};

const defaultStatus = () => {
  return {
    placeholder: "test",
  };
};

const defaultSettings = () => {
  return {
    enabled: true,
  };
};

module.exports.createControls = async (controls) => {
  const { exampleControls } = require("../controllers/controls");
  let makeInterface = {};
  
  makeInterface.id = controls.id || `cont-${makeId()}`;
  makeInterface.created = createTimeStamp();
  makeInterface.channel_id = controls.channel_id || "dev";
  makeInterface.buttons = controls.buttons || exampleControls();
  makeInterface.settings = controls.settings || defaultSettings();
  makeInterface.status = controls.status || defaultStatus();
  // makeInterface.button_input = controls

  //save controls
  console.log("SAVING CONTROLS: ", makeInterface.id);
  if (!controls.dont_save) {
    const save = await this.saveControls(makeInterface);
    // console.log(save);
    if (save) {
      // console.log("CONTROL INTERFACE CREATED: ", makeInterface);
      return makeInterface;
    }
  } else {
    console.log("Saving disabled for controls");
    return true;
  }
  return null;
};

module.exports.updateControls = async (controls) => {
  const db = require("../services/db");
  const { buttons, id } = controls;
  const query = `UPDATE controls SET buttons = $1 WHERE id = $2 RETURNING *`;
  try {
    log(`UPDATING EXISTING CONTROLS:  ${id}`);
    const result = await db.query(query, [buttons, id]);
    // console.log(result.rows[0]);
    if (result.rows[0]) {
      const details = result.rows[0];
      this.sendUpdatedControls(controls.channel_id);
      return result.rows[0];
    }
  } catch (err) {
    console.log(err);
  }
  console.log(
    "ERROR UPDATING EXISTING CONTROLS FOR",
    id,
    "UPDATE MET NO ROWS?"
  );
  return { status: "error!", error: "Problem updating controls" };
};

module.exports.saveControls = async (controls) => {
  const db = require("../services/db");
  const { id, created, buttons, settings, status } = controls;
  const dbPut = `INSERT INTO controls (id, created, buttons, settings, status) VALUES($1, $2, $3, $4, $5) RETURNING *`;
  try {
    const save = await db.query(dbPut, [
      id,
      created,
      buttons,
      settings,
      status,
    ]);
    //console.log(save.rows);
    if (save.rows) {
      console.log("Successfully saved controls for: ", controls.id);
      return true;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
  return null;
};

module.exports.getControls = async (id, channel_id) => {
  if (id) {
    //console.log("Get controls from controls ID: ", id);
    const db = require("../services/db");
    const query = `SELECT * FROM controls WHERE id = $1 LIMIT 1`;
    try {
      const result = await db.query(query, [id]);
      //console.log(result.rows[0]);
      if (result.rows[0]) {
        result.rows[0].channel_id = channel_id;
        return result.rows[0];
      }
      console.log("Error, could not fetch data for CONTROLS");
      return null;
    } catch (err) {
      console.log(err);
      return null;
    }
  } else {
    console.log(
      "No controls found on this channel, generating controls for this channel"
    );
    if (channel_id) {
      const { updateControlsId } = require("./robotChannels");
      const makeControls = await this.createControls({
        channel_id: channel_id,
      });

      //Updating for robot channels refactor
      updateControlsId(makeControls.channel_id, makeControls.id);
      if (makeControls) {
        const { emitEvent } = require("../controllers/robotChannels");
        emitEvent(makeControls.channel_id, "CONTROLS_UPDATED");
        //--------------------------------------

        return makeControls;
      }
    }
    console.log("Error, cannot find or generate controls for this channel");
  }
  return null;
};

module.exports.sendUpdatedControls = async (channel_id) => {
  //flag web client to pull updated controls
  const channel = require("../controllers/robotChannels");
  channel.emitEvent(channel_id, "CONTROLS_UPDATED");
};

module.exports.getControlsFromId = async (id) => {
  console.log("GET CONTROLS FROM ID: ", id);
  const db = require("../services/db");
  const query = `SELECT * FROM controls WHERE id = $1`;
  try {
    const result = await db.query(query, [id]);
    if (result.rows[0]) return result.rows[0];
  } catch (err) {
    console.log(err);
  }
  return null;
};

module.exports.removeControls = async (controls) => {
  const db = require("../services/db");
  const { id } = controls;
  // console.log("Removing Controls Test 0: ", id);
  const query = `DELETE FROM controls WHERE id = $1`;
  try {
    const result = await db.query(query, [id]);
    if (result.rows[0]) {
      return true;
    }
  } catch (err) {
    console.log(err);
  }

  return null;
};

module.exports.getAllControls = async () => {
  const db = require("../services/db");
  const query = `SELECT * FROM controls`;
  try {
    const result = await db.query(query);
    if (result.rows[0]) return result.rows;
  } catch (err) {
    console.log(err);
  }
  return null;
};
