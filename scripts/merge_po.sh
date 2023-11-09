#!/bin/bash

pushd `dirname $0` > /dev/null;
ROOT_DIR=`pwd`'/..';
popd > /dev/null;

echo $ROOT_DIR

create_or_merge_po_file() {
    LOCALE=$1
    FILE="${ROOT_DIR}/lang/$LOCALE.po"

    if [ ! -f $FILE ]; then
        cp "${ROOT_DIR}/lang/messages.pot" $FILE
    else
        msgmerge --backup=off -U $FILE "${ROOT_DIR}/lang/messages.pot";
    fi
}

create_po_files() {
    OLD_IFS=$IFS
    IFS=$'\n'
    for line in $(cat "${ROOT_DIR}/lang/list"); do
        create_or_merge_po_file $line
    done
    IFS=$OLD_IFS
}

# Check if file with languages list exists
if [ ! -f "${ROOT_DIR}/lang/list" ]; then
    echo "No file ${ROOT_DIR}/lang/list"
    exit 1
fi

create_po_files