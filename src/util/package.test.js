const fsExtra = require("@monadic-node/fs-extra");
const fs = require("@monadic-node/fs");

const { Async } = require("crocks");
const { collect } = require("./test-util");

jest.mock("@monadic-node/fs-extra");
jest.mock("@monadic-node/fs");

const { getVersion, list, getProp } = require("./package");

test(".getProp should return a package.json prop", () => {
  fsExtra.readJSON.mockReturnValueOnce(
    Async.of({ version: "1.0.0", name: "module-name" })
  );

  return collect(getProp("name")("packages/some-package")).then(version =>
    expect(version).toBe("module-name")
  );
});

test(".getVersion should return a package.json version", () => {
  fsExtra.readJSON.mockReturnValueOnce(Async.of({ version: "1.0.0" }));

  return collect(getVersion("packages/some-package")).then(version =>
    expect(version).toBe("1.0.0")
  );
});

test(".list should return a list of packages with absolute path", () => {
  fs.readdir.mockReturnValueOnce(Async.of(["dir-one", "dir-two"]));
  const packages = list("/monorepo");

  return collect(packages).then(result =>
    expect(result).toEqual([
      "/monorepo/packages/dir-one",
      "/monorepo/packages/dir-two"
    ])
  );
});
