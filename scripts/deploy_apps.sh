#!/bin/bash
echo -e "\n ======MODULES INSTALL START====== \n"
npm ci
echo -e "\n ======MODULES INSTALL END====== \n"
. scripts/switch.sh prod
echo -e "\n ======CONFIG_SWITCHED====== \n"
cd ios
pod install
cd ../
echo -e "\n ============DEPLOY IOS START============ \n"
npm run firebase_deploy_release_ios
echo -e "\n ============DEPLOY IOS END============ \n"
echo -e "\n ============DEPLOY ANDROID START============ \n"
npm run firebase_deploy_release_android
echo -e "\n ============DEPLOY ANDROID END============ \n"