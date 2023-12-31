#!/bin/bash

pushd `dirname $0` > /dev/null;
ROOT_DIR=`pwd`'/..';
popd > /dev/null;

# Check if file with languages list exists
if [ ! -f "${ROOT_DIR}/lang/list" ]; then
    echo "No file ${ROOT_DIR}/lang/list"
    exit 1
fi

# Transpile to ES5
"${ROOT_DIR}/node_modules/.bin/babel" "${ROOT_DIR}/src" -d "${ROOT_DIR}/src_es5";
find "${ROOT_DIR}/src_es5" -type f \( -name '*.js' \) -print > "${ROOT_DIR}/list";

# Extract phrases from source code and update exising PO files
xgettext --keyword="l:1" \
         --keyword="l:1,2c" \
         --keyword="nl:1,2" \
         --keyword="nl:1,2,4c" \
         --files-from="${ROOT_DIR}/list" \
         --language=JavaScript \
         --no-location \
         --from-code=UTF-8 \
         --output="${ROOT_DIR}/lang/messages.pot";

# Cleanup
rm -rf "${ROOT_DIR}/src_es5";
rm -rf "${ROOT_DIR}/list";