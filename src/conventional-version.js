const { listCommits, getCommitFromLastRelease } = require("./util/git");
const {
  incrementVersion,
  isConventionalCommit
} = require("./util/conventional-semver");
const { getVersion } = require("./util/package");

const { Async } = require("crocks");
const { streamToAsync } = require("@monadic-node/core/Stream/nt");
const {
  pipe,
  filter,
  reduce,
  curry,
  lift,
  identity,
  converge,
  chain,
  map
} = require("ramda");

const { createLoggerWithNamespace } = require("./util/logger");
const log = createLoggerWithNamespace("conventional-version");

// _getPackageReleaseVersionFromCommitConvention :: path -> Commit -> Version -> Async Error Version
const _getPackageReleaseVersionFromCommitConvention = curry(
  (packagePath, lastReleaseCommit, currentVersion) =>
    pipe(
      (path, from) => listCommits({ path, from }),
      filter(isConventionalCommit),
      reduce(incrementVersion, currentVersion),
      streamToAsync
    )(packagePath, lastReleaseCommit, currentVersion)
);

// getReleaseVersion :: cwd -> packagePath -> Async Error Version
const getReleaseVersion = pipe(
  converge(lift(_getPackageReleaseVersionFromCommitConvention), [
    (_, packagePath) => Async.of(packagePath),
    getCommitFromLastRelease,
    (_, packagePath) => getVersion(packagePath)
  ]),
  chain(identity),
  map(log("new release version:"))
);

module.exports = {
  _getPackageReleaseVersionFromCommitConvention,
  getReleaseVersion
};
