const git = require("./util/git");
const packageHandler = require("./util/package");
const { Async } = require("crocks");
const Stream = require("@monadic-node/core/Stream");
const { EOL } = require("os");
const { collect } = require("./util/test-util");

jest.mock("./util/git");
jest.mock("./util/package");

const { getReleaseVersion } = require("./conventional-version");

test(".getReleaseVersion should calculate release version from commit convention", () => {
  const commits = Stream.from([
    `feat: adds feat 1${EOL}`,
    `feat: adds feat 2${EOL}`,
    `BREAKING CHANGE: some br${EOL}`,
    `commit without convention${EOL}`,
    `fix: fix 1${EOL}`,
    `feat: adds feat 1${EOL}`,
    `feat: adds feat 2${EOL}`,
    `commit without convention${EOL}`,
    `fix: fix 1${EOL}`,
    `commit without convention${EOL}`
  ]);

  git.getCommitFromLastRelease.mockReturnValueOnce(Async.of("6776e03e"));
  git.listCommits.mockReturnValueOnce(commits);
  packageHandler.getVersion.mockReturnValueOnce(Async.of("1.0.0"));

  return collect(
    getReleaseVersion("/cwd", "/packages/some-package")
  ).then(version => expect(version).toEqual("2.2.1"));
});
