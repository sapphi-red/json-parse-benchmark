// Copyright 2019 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the “License”);
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// <https://apache.org/licenses/LICENSE-2.0>.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an “AS IS” BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
// implied. See the License for the specific language governing
// permissions and limitations under the License.

const fs = require('fs');

const data = require('./data.js');

const tryWithSliced = (slicedData) => {
  const json = JSON.stringify(slicedData);
  if (json.length < nextSize) return;

  const currentSizeInKb = nextSize / 1000;
  nextSize += 10000;
  if (nextSize >= endSize) return true;

  const jsStringLiteral = JSON.stringify(json);

  fs.writeFileSync(`./out/json.${currentSizeInKb}.js`,
                   `const data = JSON.parse(${ jsStringLiteral });\n`);

  // JSON is a syntactic subset of ECMAScript as of
  // https://github.com/tc39/proposal-json-superset, so we can
  // safely inject the JSON-stringified data as an array literal.
  // (We'd need additional escaping if the target was a <script> tag.)
  fs.writeFileSync(`./out/js.${currentSizeInKb}.js`,
                   `const data = ${ json };\n`);
}

let nextSize = 10000;
const endSize = 21 * 10000;
out:
for (let i = 1; i < data.length; i++) {
  const slicedData = JSON.parse(JSON.stringify(data.slice(0, i)));
  const lastData = slicedData.at(-1)
  if ('result' in lastData && 'cssProperties' in lastData.result) {
    const cssProperties = [...lastData.result.cssProperties]
    for (let j = 0; j < cssProperties.length; j++) {
      lastData.result.cssProperties = cssProperties.slice(0, j);
      const lastProp = lastData.result.cssProperties.at(-1)
      if (lastProp && 'longhands' in lastProp) {
        const longHands = [...lastProp.longhands]
        for (let k = 0; k < longHands.length; k++) {
          lastProp.longhands = longHands.slice(0, k);
          const end = tryWithSliced(slicedData);
          if (end) {
            break out;
          }
        }
      }
      const end = tryWithSliced(slicedData);
      if (end) {
        break out;
      }
    }
  } else {
    const end = tryWithSliced(slicedData);
    if (end) {
      break out;
    }
  }
}

const json = JSON.stringify(data);
const jsStringLiteral = JSON.stringify(json);

fs.writeFileSync(`./out/json.js`,
                 `const data = JSON.parse(${ jsStringLiteral });\n`);

// JSON is a syntactic subset of ECMAScript as of
// https://github.com/tc39/proposal-json-superset, so we can
// safely inject the JSON-stringified data as an array literal.
// (We'd need additional escaping if the target was a <script> tag.)
fs.writeFileSync(`./out/js.js`,
                 `const data = ${ json };\n`);
