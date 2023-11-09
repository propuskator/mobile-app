#!/bin/bash

if [ "$1" ]
then
    if [ -e "./config/$1/.env" ]
    then
        cat "./config/$1/.env" > .env
        cat "./config/$1/.build.env" > .build.env
        cat "./config/$1/keystore.properties" > ./android/keystore.properties
        cat "./config/$1/my-release-key.keystore" > ./android/app/my-release-key.keystore
        cat "./config/$1/google-services.json" > ./android/app/google-services.json
        cat "./config/$1/GoogleService-Info.plist" > ./ios/accesscontrol/GoogleService-Info.plist
        cp -rf "./config/$1/ios-icon.png" ./ios-icon.png
        cp -rf "./config/$1/android-icon.png" ./android-icon.png
        echo "Config successfully changed to $1"
    else
        echo "Config file .env not found"
    fi
else
    echo "You should pass staging name(e.g. qa, prod, etc)"
fi