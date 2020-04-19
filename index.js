const CWD = process.cwd();

/*
const { join } = require("path");
const PACKAGE = join(CWD, process.argv[2]);
const { getReleaseVersion } = require("./src/conventional-version");
getReleaseVersion(CWD, PACKAGE).fork(console.error, console.log);
*/

const { sortPackagesToRelease } = require("./src/package-release");

sortPackagesToRelease(CWD).fork(console.log, console.log);
