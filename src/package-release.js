const { allPackagesJSON, getProp } = require("./util/package");
const toposort = require("toposort");
const {
  pipe,
  pick,
  map,
  evolve,
  keys,
  chain,
  identity,
  reverse,
  curry,
  filter,
  includes,
  converge,
  lift
} = require("ramda");

// getNameSpace :: cwd -> Async Error String
const _getNameSpace = getProp("name");

// createGraph :: String -> JSON -> [[String, String]]
const _createGraph = curry((nameSpace, json) =>
  pipe(
    pick(["name", "dependencies"]),
    evolve({ dependencies: pipe(keys, filter(includes(nameSpace))) }),
    ({ name, dependencies }) => {
      return map(dependency => [name, dependency], dependencies || []);
    }
  )(json)
);

// _listPackagesToRelease :: String -> [JSON] -> [String]
const _sortPackagesToRelease = curry((nameSpace, packages) =>
  pipe(
    map(_createGraph(nameSpace)),
    chain(identity),
    pipe(toposort, reverse)
  )(packages)
);

// sortPackagesToRelease :: cwd -> Async Error [String]
const sortPackagesToRelease = converge(lift(_sortPackagesToRelease), [
  _getNameSpace,
  allPackagesJSON
]);

module.exports = {
  _sortPackagesToRelease,
  _createGraph,
  _getNameSpace,
  sortPackagesToRelease
};
