#!/usr/bin/env node

VERSION=$(node -e "console.log(require('./package.json').version)")
BUILD=$(cat .build)

let "BUILD=BUILD+1"

capacitor-set-version -v $VERSION -b $BUILD --json

echo $BUILD > .build
