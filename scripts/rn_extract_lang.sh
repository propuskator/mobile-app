#!/bin/bash

pushd `dirname $0` > /dev/null;
ROOT_DIR=`pwd`'/..';
popd > /dev/null;

# Check if file with languages list exists
if [ ! -f "${ROOT_DIR}/lang/list" ]; then
    echo "No file ${ROOT_DIR}/lang/list"
    exit 1
fi

# change .babelrc configs
cat "$ROOT_DIR/.babelrc" > .babelrc.tmp

cat > "$ROOT_DIR/.babelrc" <<EOF
{
  "presets": [
    "stage-2",
    "react"
  ]
}
EOF

./scripts/extract_lang.sh

# Cleanup
cat .babelrc.tmp > "$ROOT_DIR/.babelrc"
rm -rf .babelrc.tmp