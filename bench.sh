#!/usr/bin/env bash

# Copyright 2019 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the “License”);
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# <https://apache.org/licenses/LICENSE-2.0>.
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an “AS IS” BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
# implied. See the License for the specific language governing
# permissions and limitations under the License.

export PATH="${HOME}/.jsvu/bin:${PATH}"

binaries="
  v8
  javascriptcore
  spidermonkey
";
END_FILE_SIZE_I=19
TIMEFORMAT=%lR;
for bin in $binaries; do
  for i in $(seq 1 $END_FILE_SIZE_I); do
    file_size=$(( i * 10 ))
    JS_FILE="out/js.${file_size}.js"
    JSON_FILE="out/json.${file_size}.js"

    printf "Benchmarking JS literal on ${bin} for ${JS_FILE}… ";
    time (for _ in {1..100}; do $bin "${JS_FILE}"; done);
    printf "Benchmarking JSON.parse on ${bin} for ${JSON_FILE}… ";
    time (for _ in {1..100}; do $bin "${JSON_FILE}"; done);

    # if [[ $bin == v8* ]]; then
    #   printf "Benchmarking JS literal with cold loads on ${bin}…\n";
    #   time $bin realm-js.js --nocompilation-cache;
    #   printf "Benchmarking JSON.parse with cold loads on ${bin}…\n";
    #   time $bin realm-json.js --nocompilation-cache;
    #   printf "Benchmarking JS literal with warm loads on ${bin}…\n";
    #   time $bin realm-js.js;
    #   printf "Benchmarking JSON.parse with warm loads on ${bin}…\n";
    #   time $bin realm-json.js;
    # fi;
  done

  JS_FILE="out/js.js"
  JSON_FILE="out/json.js"
  printf "Benchmarking JS literal on ${bin} for ${JS_FILE}… ";
  time (for _ in {1..100}; do $bin "${JS_FILE}"; done);
  printf "Benchmarking JSON.parse on ${bin} for ${JSON_FILE}… ";
  time (for _ in {1..100}; do $bin "${JSON_FILE}"; done);
done
