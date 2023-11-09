#!/bin/bash

build_and_deploy_ios() {
    echo "BUILD IOS"
    cd ios
    pod install
    cd ../
    npm start -- --reset-cache & RN_IOS_PROCESS=$!
    npm run firebase_deploy_ios
    kill -SIGINT ${RN_IOS_PROCESS}
    wait
}

build_and_deploy_android() {
    echo "BUILD ANDROID"
    npm run firebase_deploy_android
}

case "$MODE" in
    ios)
        build_and_deploy_ios
    ;;
    android)
        build_and_deploy_android
    ;;
    release)
        . scripts/deploy_apps.sh
    ;;
    *)
        build_and_deploy_android
        build_and_deploy_ios
    ;;
esac
