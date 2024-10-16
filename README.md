# `JSON.parse` benchmark

See [the cost of parsing JSON](https://v8.dev/blog/cost-of-javascript-2019#json).

Forked from [GoogleChromeLabs/json-parse-benchmark](https://github.com/GoogleChromeLabs/json-parse-benchmark).

## Instructions

Clone this repository, and then run these commands:

```bash
npm install
export PATH="${HOME}/.jsvu/bin:${PATH}"
npm run bench
```

## Analysis

[`JetStream2/SeaMonster/inspector-json-payload.js`](https://raw.githubusercontent.com/WebKit/webkit/ffdd2799d3237993354978b9d0cdd1d248fe3787/PerformanceTests/JetStream2/SeaMonster/inspector-json-payload.js) contains a 7.33-MB JavaScript array literal containing 846 object literals. This entire array literal can be [serialized to JSON](https://github.com/GoogleChromeLabs/json-parse-benchmark/blob/c0dec965dfbb6e30f077974ce172296f1f90d5da/build.js#L18) and [turned into a 8.2-MB JavaScript string literal](https://github.com/GoogleChromeLabs/json-parse-benchmark/blob/c0dec965dfbb6e30f077974ce172296f1f90d5da/build.js#L19), which can be [passed to `JSON.parse()`](https://github.com/GoogleChromeLabs/json-parse-benchmark/blob/c0dec965dfbb6e30f077974ce172296f1f90d5da/build.js#L22) to produce an equivalent array.

This repository tests each approach in 100 different contexts in the dumbest possible way, i.e. by simply invoking `d8` a 100 times per script. That is, we perform 100 cold loads, and measure everything (parsing, compilation, and execution) until the program halts.

On my workstation (Ryzen 5900X, 32GB DDR4 3600MHz RAM, Windows, WSL2), I got the following results:

| JS Engine              | File size | JS literal | `JSON.parse` |
| ---------------------- | --------- | ---------: | -----------: |
| V8 v13.2.9             |      10kB |    1.364 s |      1.325 s |
| V8 v13.2.9             |      20kB |    1.341 s |      1.346 s |
| V8 v13.2.9             |      30kB |    1.377 s |      1.370 s |
| V8 v13.2.9             |      40kB |    1.490 s |      1.430 s |
| V8 v13.2.9             |      50kB |    3.352 s |      1.382 s |
| V8 v13.2.9             |      60kB |    1.485 s |      1.407 s |
| V8 v13.2.9             |      70kB |    1.463 s |      1.395 s |
| V8 v13.2.9             |      80kB |    1.431 s |      1.310 s |
| V8 v13.2.9             |      90kB |    1.396 s |      1.325 s |
| V8 v13.2.9             |     100kB |    1.438 s |      1.415 s |
| V8 v13.2.9             |     110kB |    1.646 s |      1.503 s |
| V8 v13.2.9             |     120kB |    1.631 s |      1.459 s |
| V8 v13.2.9             |     130kB |    1.634 s |      1.490 s |
| V8 v13.2.9             |     140kB |    1.652 s |      1.489 s |
| V8 v13.2.9             |     150kB |    1.671 s |      1.507 s |
| V8 v13.2.9             |     160kB |    3.688 s |      1.536 s |
| V8 v13.2.9             |     170kB |    1.674 s |      1.486 s |
| V8 v13.2.9             |     180kB |    1.665 s |      1.452 s |
| V8 v13.2.9             |     190kB |    1.568 s |      1.397 s |
| V8 v13.2.9             |    7334kB |   12.825 s |      6.371 s |
| JavaScriptCore v285255 |      10kB |    0.705 s |      0.689 s |
| JavaScriptCore v285255 |      20kB |    0.737 s |      0.747 s |
| JavaScriptCore v285255 |      30kB |    0.838 s |      0.768 s |
| JavaScriptCore v285255 |      40kB |    0.787 s |      0.762 s |
| JavaScriptCore v285255 |      50kB |    0.847 s |      0.762 s |
| JavaScriptCore v285255 |      60kB |    0.858 s |      0.754 s |
| JavaScriptCore v285255 |      70kB |    0.863 s |      0.781 s |
| JavaScriptCore v285255 |      80kB |    0.885 s |      0.800 s |
| JavaScriptCore v285255 |      90kB |    0.892 s |      0.785 s |
| JavaScriptCore v285255 |     100kB |    0.912 s |      0.786 s |
| JavaScriptCore v285255 |     110kB |    1.044 s |      0.850 s |
| JavaScriptCore v285255 |     120kB |    1.111 s |      0.842 s |
| JavaScriptCore v285255 |     130kB |    3.083 s |      0.874 s |
| JavaScriptCore v285255 |     140kB |    1.081 s |      0.964 s |
| JavaScriptCore v285255 |     150kB |    1.146 s |      0.896 s |
| JavaScriptCore v285255 |     160kB |    1.077 s |      0.892 s |
| JavaScriptCore v285255 |     170kB |    1.041 s |      0.814 s |
| JavaScriptCore v285255 |     180kB |    0.991 s |      0.824 s |
| JavaScriptCore v285255 |     190kB |    1.003 s |      0.846 s |
| JavaScriptCore v285255 |    7334kB |   13.760 s |      4.813 s |
| SpiderMonkey v132.0b7  |      10kB |    1.069 s |      1.034 s |
| SpiderMonkey v132.0b7  |      20kB |    1.059 s |      1.060 s |
| SpiderMonkey v132.0b7  |      30kB |    1.078 s |      1.069 s |
| SpiderMonkey v132.0b7  |      40kB |    1.112 s |      1.121 s |
| SpiderMonkey v132.0b7  |      50kB |    1.164 s |      1.133 s |
| SpiderMonkey v132.0b7  |      60kB |    1.183 s |      1.162 s |
| SpiderMonkey v132.0b7  |      70kB |    1.195 s |      1.235 s |
| SpiderMonkey v132.0b7  |      80kB |    1.208 s |      1.189 s |
| SpiderMonkey v132.0b7  |      90kB |    3.308 s |      1.228 s |
| SpiderMonkey v132.0b7  |     100kB |    1.256 s |      1.226 s |
| SpiderMonkey v132.0b7  |     110kB |    1.383 s |      1.415 s |
| SpiderMonkey v132.0b7  |     120kB |    1.410 s |      1.225 s |
| SpiderMonkey v132.0b7  |     130kB |    1.273 s |      1.263 s |
| SpiderMonkey v132.0b7  |     140kB |    1.265 s |      1.240 s |
| SpiderMonkey v132.0b7  |     150kB |    1.266 s |      1.242 s |
| SpiderMonkey v132.0b7  |     160kB |    1.291 s |      1.247 s |
| SpiderMonkey v132.0b7  |     170kB |    1.283 s |      1.249 s |
| SpiderMonkey v132.0b7  |     180kB |    1.282 s |      1.285 s |
| SpiderMonkey v132.0b7  |     190kB |    1.360 s |      1.290 s |
| SpiderMonkey v132.0b7  |    7334kB |   10.209 s |      8.043 s |

## Licensing

The source files in this repository are released under the Apache 2.0 license, as detailed in the LICENSE file.

The scripts in this repository dynamically download [`JetStream2/SeaMonster/inspector-json-payload.js`](https://raw.githubusercontent.com/WebKit/WebKit/ab7171c1d63acb8c77216b5a11f98323b56b998b/PerformanceTests/JetStream2/SeaMonster/inspector-json-payload.js), which has its own license:

```
/*
 * Copyright (C) 2018 Apple Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. AND ITS CONTRIBUTORS ``AS IS''
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL APPLE INC. OR ITS CONTRIBUTORS
 * BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
 * THE POSSIBILITY OF SUCH DAMAGE.
*/
```

This license also applies to the generated `*.js` files produced by the scripts in this repository.
