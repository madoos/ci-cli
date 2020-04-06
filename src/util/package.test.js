const fs = require("@monadic-node/fs-extra");
const { Async } = require("crocks");
const { collect } = require("./test-util");

jest.mock("@monadic-node/fs-extra");

const { getVersion } = require("./package");

test(".getVersion should return a package.json version", () => {
  fs.readJSON.mockReturnValueOnce(Async.of({ version: "1.0.0" }));

  return collect(getVersion("packages/some-package")).then(version =>
    expect(version).toBe("1.0.0")
  );
});
