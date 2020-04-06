const semver = require("semver");
const { startsWith, anyPass } = require("ramda");

// isFeature :: String -> Boolean
const isFeature = startsWith("feat");

// isFix :: String -> Boolean
const isFix = startsWith("fix");

// isBreakingChange :: String -> Boolean
const isBreakingChange = startsWith("BREAKING CHANGE");

// semverCommits :: String -> Boolean
const isConventionalCommit = anyPass([isFeature, isFix, isBreakingChange]);

// incrementVersion :: (Version, String) -> Version
const incrementVersion = (version, commit) => {
  const type = isBreakingChange(commit)
    ? "major"
    : isFeature(commit)
    ? "minor"
    : "patch";
  return semver.inc(version, type);
};

module.exports = {
  isFeature,
  isFix,
  isBreakingChange,
  isConventionalCommit,
  incrementVersion
};
