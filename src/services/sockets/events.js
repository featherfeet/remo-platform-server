//Socket.io Events
module.exports = {
  TEST_EVENT: "TEST_EVENT",
  TEST_RESPONSE: "TEST_RESPONSE",
  LOCAL_CHAT: "LOCAL_CHAT",
  USER_CONNECTED: "USER_CONNECTED",
  MESSAGE_RECIEVED: "MESSAGE_RECIEVED",
  MESSAGE_SENT: "MESSAGE_SENT",
  USER_DISCONNECTED: "USER_DISCONNECTED",
  TYPING: "TYPING",
  VERIFY_USER: "VERIFY_USER",
  LOGOUT: "LOGOUT",
  USERS_UPDATED: "USERS_UPDATED",
  HEARTBEAT: "HEARTBEAT"
};

module.exports.socketEvents = {
  GET_CHAT_ROOMS: "GET_CHAT_ROOMS",
  SEND_ROBOT_SERVER_INFO: "SEND_ROBOT_SERVER_INFO",
  AUTHENTICATE: "AUTHENTICATE",
  VALIDATED: "VALIDATED",
  ROBOT_SERVER_UPDATED: "ROBOT_SERVER_UPDATED",
  GET_CHAT: "GET_CHAT",
  SEND_CHAT: "SEND_CHAT",
  ACTIVE_USERS_UPDATED: "ACTIVE_USERS_UPDATED",
  MESSAGE_SENT: "MESSAGE_SENT",
  TIMEOUT: "TIMEOUT"
};
