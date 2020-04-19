const { readJSON } = require("@monadic-node/fs-extra");
const { readdir } = require("@monadic-node/fs");
const { pipe, map, prop, concat, __, curry } = require("ramda");

const PACKAGES_PATH = "packages";
const PACKAGE_JSON_FILE = "package.json";

const { createLoggerWithNamespace } = require("./logger");
const log = createLoggerWithNamespace("package");

// getProp :: String -> Path -> Async Error a
const getProp = curry((key, cwd) =>
  pipe(concat(__, `/${PACKAGE_JSON_FILE}`), readJSON, map(prop(key)))(cwd)
);

// getVersion :: Path -> Async Error Version
const getVersion = pipe(
  log("package path:"),
  getProp("version"),
  map(log("current version in package.json:"))
);

// list :: cwd -> Async Error [path]
const list = cwd =>
  pipe(
    concat(__, `/${PACKAGES_PATH}`),
    readdir,
    map(map(concat(`${cwd}/${PACKAGES_PATH}/`)))
  )(cwd);

// allPackagesJSON :: cwd -> Async Error [JSON]
const allPackagesJSON = pipe(
  list,
  map(map(pipe(concat(__, `/${PACKAGE_JSON_FILE}`), require)))
);

module.exports = {
  getProp,
  getVersion,
  list,
  allPackagesJSON
};
