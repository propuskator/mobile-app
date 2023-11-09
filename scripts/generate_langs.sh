#!/bin/bash

if [ ! -d "lang" ]; then
    mkdir "lang"
fi

if [ ! -f "lang/list" ]; then
    touch "lang/list"
    echo en > "lang/list"
fi

./scripts/rn_extract_lang.sh
./scripts/merge_po.sh
./scripts/po2json.sh
