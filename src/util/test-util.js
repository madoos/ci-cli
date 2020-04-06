const { PassThrough } = require("stream");
const { assoc, pipe, __, map, identity } = require("ramda");

//  collect :: (Type a, a -> b) -> Promise Error ([a] | a)
const collect = (src, transform = identity) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const push = data => results.push(data);
    const resolveResults = () => resolve(map(transform, results));

    if (src.consume) {
      src.consume(push, reject, resolveResults);
    } else if (src.fork) {
      src.fork(reject, resolve);
    } else {
      src
        .on("data", push)
        .on("error", reject)
        .on("end", resolveResults)
        .on("finish", resolveResults);
    }
  });
};

// createMockStream :: [a] -> NodeJSStream a
const createMockStream = data => {
  const stream = new PassThrough();
  data.forEach(chunk => stream.write(chunk));
  process.nextTick(() => {
    stream.emit("finish");
    stream.emit("end");
  });
  return stream;
};

// createStdoutMock :: [a] -> { stdout: NodeJSStream a }
const createStdoutMock = pipe(createMockStream, assoc("stdout", __, {}));

module.exports = {
  collect,
  createMockStream,
  createStdoutMock
};
