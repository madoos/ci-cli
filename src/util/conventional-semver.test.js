const {
  isFeature,
  isFix,
  isBreakingChange,
  isConventionalCommit,
  incrementVersion
} = require("./conventional-semver");

test(".isFeature should return true for conventional commit", () => {
  expect(isFeature("feat: adds a new feature")).toBe(true);
  expect(isFeature("feat adds a new feature")).toBe(true);
  expect(isFeature("adds a new feature")).toBe(false);
  expect(isFeature("feat(context) adds a new feature")).toBe(true);
});

test(".isFix should return a true for conventional commit", () => {
  expect(isFix("fix: adds a new fix")).toBe(true);
  expect(isFix("adds a new fix")).toBe(false);
  expect(isFix("fix(context) adds a new fix")).toBe(true);
  expect(isFix("fix adds a new fix")).toBe(true);
});

test(".isBreakingChange should return a true for conventional commit", () => {
  expect(isBreakingChange("BREAKING CHANGE: adds a new breaking change")).toBe(
    true
  );
  expect(isBreakingChange("adds a new fix")).toBe(false);
  expect(isBreakingChange("BREAKING CHANGE adds a breaking change")).toBe(true);
  expect(
    isBreakingChange("BREAKING CHANGE(context): adds a breaking change")
  ).toBe(true);
});

test(".isConventionalCommit should return a true for conventional commit", () => {
  expect(isConventionalCommit("fix: adds a new fix")).toBe(true);
  expect(isConventionalCommit("adds a new fix")).toBe(false);
  expect(isConventionalCommit("feat(context) adds a new fix")).toBe(true);
  expect(isConventionalCommit("BREAKING CHANGE: adds a new fix")).toBe(true);
  expect(isConventionalCommit("BREAKING: adds a new fix")).toBe(false);
});

test(".incrementVersion should return a new version", () => {
  expect(incrementVersion("1.0.0", "adds a new fix")).toBe("1.0.1");
  expect(incrementVersion("1.1.0", "fix: adds a new fix")).toBe("1.1.1");
  expect(incrementVersion("1.1.1", "feat: adds a new fix")).toBe("1.2.0");
  expect(incrementVersion("1.1.1", "BREAKING CHANGE: adds a new fix")).toBe(
    "2.0.0"
  );
});
