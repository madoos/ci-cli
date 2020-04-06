const debug = require("debug");
const { tap } = require("ramda");

// createLogsWithNamespace :: String -> (String -> String -> ())
const createLoggerWithNamespace = namespace => {
  const logger = debug(namespace);
  return message => tap(data => logger(`${message} ${data}`));
};

module.exports = {
  createLoggerWithNamespace
};
