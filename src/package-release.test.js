const { _sortPackagesToRelease, _createGraph } = require("./package-release");

test("._createGraph should create a correct dependency graph", () => {
  const graph = _createGraph("B", {
    name: "A",
    dependencies: {
      B1: "1.0.0",
      B2: "1.0.0",
      C: "1.0.0"
    }
  });

  const expected = [
    ["A", "B1"],
    ["A", "B2"]
  ];

  expect(graph).toEqual(expected);
});

test("._sortPackagesToRelease", () => {
  const packages = [
    {
      name: "module-a",
      dependencies: {}
    },
    {
      name: "module-b",
      dependencies: {
        "module-a": "1.0.0",
        "other-dependency": "2.1.0"
      }
    },
    {
      name: "module-c",
      dependencies: {
        "module-a": "1.0.0",
        "module-b": "1.0.0",
        "other-dependency": "2.1.0"
      }
    },
    {
      name: "module-d",
      dependencies: {
        "module-c": "1.0.0"
      }
    },
    {
      name: "module-e",
      dependencies: {
        "module-a": "1.0.0"
      }
    },
    {
      name: "module-f",
      dependencies: { "module-b": "1.0.0" }
    }
  ];

  const namespace = "module";
  const result = _sortPackagesToRelease(namespace, packages);

  const expected = [
    "module-a",
    "module-b",
    "module-f",
    "module-e",
    "module-c",
    "module-d"
  ];

  expect(result).toEqual(expected);
});
