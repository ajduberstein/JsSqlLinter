#!/bin/bash
CMD="./node_modules/babel-cli/bin/babel-node.js --presets node6 ./src/index.js"
BARS="echo ==========="
$BARS
$CMD
fswatch -o . | while read; do $BARS; $CMD; done
