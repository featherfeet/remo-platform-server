const { checkType } = require("../modules/validation");
const { jsonError } = require("../modules/logging");
const { alphaNum_, emailRegex, asciiRegex } = require("../modules/getRegex");
const { reservedWordsDefault } = require("../models/filters");

// DATA VALIDATION

//SETTINGS:
const typeDefault = "string";

//VALIDATOR Interfaces
module.exports.validateButtonsJSON = (input) => {
  const { maxButtons } = require("../config");
  if (input.length > maxButtons)
    return jsonError(
      `Max entries exceeded, no more than ${maxButtons} buttons are allowed`
    );
  return input;
};

module.exports.validateButton = ({
  input,
  label,
  max,
  min,
  notRequired,
  type,
}) => {
  // console.log("VALIDATE BUTTON VALUE: ", label, input, "type: ", type);
  if (notRequired && input === "") return "";
  return this.validator({
    input: input,
    label: label,
    max: max || 64,
    min: min || 1,
    regex: asciiRegex,
    regexInfo: "ASCII Characters",
    type: type || typeDefault,
  });
};

module.exports.validateServerName = (input) => {
  return this.validator({
    input: input,
    label: "Server Name",
    max: 18,
    min: 4,
    removeSpaces: true,
    filter: "reserved",
    regex: alphaNum_,
  });
};

module.exports.validateUserName = (input) => {
  return this.validator({
    input: input,
    label: "UserName",
    max: 18,
    min: 4,
    removeSpaces: true,
    filter: "reserved",
    regex: alphaNum_,
  });
};

module.exports.validateChannelName = (input) => {
  return this.validator({
    input: input,
    label: "Channel Name",
    max: 18,
    min: 3,
    removeSpaces: true,
    regex: alphaNum_,
  });
};

module.exports.validateRobotName = (input) => {
  return this.validator({
    input: input,
    label: "Robot Name",
    max: 18,
    min: 3,
    removeSpaces: true,
    regex: alphaNum_,
  });
};

module.exports.validateUserEmail = (input) => {
  return this.validator({
    input: input,
    label: "Email",
    max: 64,
    min: 5,
    removeSpaces: true,
    regex: emailRegex,
    regexInfo: "a valid email format, example: name@domain.com",
  });
};

module.exports.validator = (
  { input, label, type, max, min, regex, regexInfo, removeSpaces, filter } = {
    label: label || "Input",
    type: type || typeDefault,
    regex: regex || alphaNum_,
    regexInfo: regexInfo || "Letters, Numbers, and Underscores",
    filter: filter || "none",
  }
) => {
  let updateInput = input;
  if (!input) {
    return jsonError(`A value is required for ${label}`);
  }

  if (type && !checkType(input, type)) {
    return jsonError(`Wrong data type for ${label}, ${type} required.`);
  }

  if (removeSpaces) updateInput = updateInput.replace(/\s+/g, "");

  if (max && input.length > max) {
    return jsonError(
      `${label} can be no longer than ${max} characters in length.`
    );
  }

  if (min && input.length < min) {
    return jsonError(`${label} must be at least ${min} characters in length`);
  }

  if (regex && !regex.test(input)) {
    return jsonError(`${label} can only contain ${regexInfo}.`);
  }

  if (filter === "reserved" && reservedWordsDefault().includes(updateInput)) {
    return jsonError(
      `${updateInput} isn't available, please try a different ${label}`
    );
  }

  return updateInput;
};
