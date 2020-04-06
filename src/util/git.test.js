const cp = require("child_process");
const rawCommits = require("git-raw-commits");

const { collect, createStdoutMock, createMockStream } = require("./test-util");
const { toString, pipe, replace } = require("ramda");
const { EOL } = require("os");

jest.mock("child_process");
jest.mock("git-raw-commits");

const { gitBlame, listCommits, getCommitFromLastRelease } = require("./git");

test(".gitBlame should return an stream with blame list list", () => {
  const commitList = [
    `67921fc3 (Some User 2020-02-07 08:41:16 +0100  3) "version": "1.1.1"`
  ];

  cp.spawn.mockReturnValueOnce(createStdoutMock(commitList));
  const blame = gitBlame("/some/git/path", "/some/file");

  return collect(blame, toString).then(result => {
    return expect(result).toEqual(commitList);
  });
});

test(".listCommits should return an Stream ADT of clean commits", () => {
  rawCommits.mockImplementation(() =>
    createMockStream([
      [
        "feat: adds some feat",
        " fix: adds some fix ",
        " BREAKING CHANGE: adds some breaking change ",
        "     ",
        "some commit without convention"
      ].join(EOL),
      EOL,
      `feat: other feat`
    ])
  );

  const commits = listCommits({
    path: "some/package/path",
    from: "ca59ed866fda"
  });

  const toStringCleanQuotes = pipe(toString, replace(/"/g, ""));

  return collect(commits, toStringCleanQuotes).then(results => {
    return expect(results).toEqual([
      "feat: adds some feat",
      "fix: adds some fix",
      "BREAKING CHANGE: adds some breaking change",
      "some commit without convention",
      "feat: other feat"
    ]);
  });
});

test(".getCommitFromLastRelease should get the last commit that has changed to package version", () => {
  cp.spawn.mockReturnValueOnce(
    createStdoutMock([
      [
        `6776e03e (some user one   2019-06-12 15:20:02 +0200  1) {`,
        `6776e03e (some user one   2019-06-12 15:20:02 +0200  2)   "name": "@cells-components/cells-generic-dp",`,
        `67921fc3 (some user two 2020-02-07 08:41:16 +0100  3)   "version": "1.1.1",`,
        `6776e03e (some user one   2019-06-12 15:20:02 +0200  4)   "description": "Web Component to perform an AJAX request to any API environment.",`,
        `6776e03e (some user one   2019-06-12 15:20:02 +0200  5)   "main": "cells-generic-dp.js",`,
        `6776e03e (some user one   2019-06-12 15:20:02 +0200  6)   "dependencies": {`,
        `6776e03e (some user one   2019-06-12 15:20:02 +0200  7)     "lit-element": "^2.0.1",`,
        `6776e03e (some user one   2019-06-12 15:20:02 +0200  8)     "rxjs": "^6.5.2"`,
        `6776e03e (some user one   2019-06-12 15:20:02 +0200  9)   },`,
        `6776e03e (some user one   2019-06-12 15:20:02 +0200 10)   "devDependencies": {`,
        `f2b1b5a3 (Oscar marina       2019-12-17 11:40:12 +0100 11)     "@bbva-web-components/bbva-button-default": "^3.0.0",`,
        `f2b1b5a3 (Oscar marina       2019-12-17 11:40:12 +0100 12)     "@cells/cells-component-core": "^1.0.0"`,
        `6776e03e (some user one   2019-06-12 15:20:02 +0200 13)   }`,
        `6776e03e (some user one   2019-06-12 15:20:02 +0200 14) }`
      ].join(EOL)
    ])
  );

  return collect(
    getCommitFromLastRelease("/some/path", "/some/package")
  ).then(commit => expect(commit).toEqual("67921fc3"));
});
