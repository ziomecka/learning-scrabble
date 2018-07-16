/* jshint esversion: 6 */
module.exports = {
  authorizeOption: data => `User ${data.login} being authorized via: ${data.option === "Number"? data.option + "(cookies)" : data.option}.`,
  authorizeSuccess: login => `User ${login} authorized.`,
  authorizePasswordFailure: login => `Incorrect ${login}'s password.'`,
  authorizeLoginFailure: login => `Login ${login} does not exist.'`,
  authorizeDataFailure: () => "Something went wrong. The data is corrupted?",
  socketRegisterSuccess: data => `Socket ${data.socketId} has been registered with login ${data.login}.`,
  socketRegisterFailure: data => `Socket ${data.socketId} has NOT been registered.`,
  socketUnregisterSuccess: data => `Socket ${data.socketId} and login ${data.login} have been unregistered.`,
  socketUnregisterFailure: data => `Socket ${data.socketId} and login ${data.login} have NOT been unregistered.`,
  loginAlreadyExists: () => `Login already exists`,
  redisConnectionError: () => `Redis is not available.`
};
