const { toStream, } = require('@monadic-node/core')
const { map, pipe, trim, reject, isEmpty, reduce, concat } = require('ramda') 
const es  = require('event-stream')

const gitRawCommits = pipe(
  toStream(require('git-raw-commits')), 
  map(es.split()),
  map(trim),
  reject(isEmpty),
  //reduce(concat, '1.0.0')
)

gitRawCommits({
  path: 'packages/main',
 // from: 'v1.1.0',
 //format: '%B%n-hash-%n%H'
})
.consume(
  console.log,
  console.error,
  () => console.log('completed------------------<')
)
