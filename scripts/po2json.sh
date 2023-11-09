#!/bin/bash

pushd `dirname $0` > /dev/null;
ROOT_DIR=`pwd`'/..';
popd > /dev/null;

create_json_from_po() {
    LOCALE=$1
    
    node "${ROOT_DIR}/node_modules/po2json/bin/po2json" "${ROOT_DIR}/lang/$LOCALE.po" -f jed1.x -p "${ROOT_DIR}/lang/$LOCALE.json"
}

OLD_IFS=$IFS
IFS=$'\n'
for line in $(cat "${ROOT_DIR}/lang/list"); do
    create_json_from_po $line
done
IFS=$OLD_IFS
