const { readJSON } = require("@monadic-node/fs-extra");
const { pipe, map, prop, concat, __ } = require("ramda");

const { createLoggerWithNamespace } = require("./logger");
const log = createLoggerWithNamespace("package");

// getVersion :: Path -> Async Error Version
const getVersion = pipe(
  log("package path:"),
  concat(__, "/package.json"),
  readJSON,
  map(prop("version")),
  map(log("current version in package.json:"))
);

module.exports = {
  getVersion
};
