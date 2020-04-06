const rawCommits = require("git-raw-commits");
const { spawn } = require("child_process");
const es = require("event-stream");
const { toStream } = require("@monadic-node/core");
const { streamToAsync } = require("@monadic-node/core/Stream/nt");

const { createLoggerWithNamespace } = require("./logger");
const log = createLoggerWithNamespace("git");

const {
  trim,
  reject,
  isEmpty,
  pipe,
  prop,
  map,
  toString,
  split,
  head,
  filter,
  includes
} = require("ramda");

// listCommits :: { path: Path, from: Version } -> Stream Error HashCommit
const listCommits = pipe(
  toStream(rawCommits),
  map(es.split()),
  map(trim),
  reject(isEmpty),
  map(log("commit list:"))
);

// gitBlame :: (cwd, path) -> Node Stream
const gitBlame = pipe(
  (cwd, file) => spawn("git", ["blame", file], { cwd }),
  prop("stdout")
);

// getCommitFromLastRelease :: (cwd, packagePath) -> Async Error HashCommit
const getCommitFromLastRelease = pipe(
  toStream((cwd, packagePath) => gitBlame(cwd, `${packagePath}/package.json`)),
  map(toString),
  map(es.split()),
  filter(includes(`"version":`)),
  map(split(" ")),
  map(head),
  streamToAsync,
  map(log("commit from last release:"))
);

module.exports = {
  listCommits,
  getCommitFromLastRelease,
  gitBlame
};
