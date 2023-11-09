#!/bin/bash
echo -e "\n ============DEPLOY IOS============ \n"
echo -e "\n ======MODULES INSTALL START====== \n"
npm ci
echo -e "\n ======MODULES INSTALL END====== \n"
. scripts/switch.sh prod
echo -e "\n ======CONFIG_SWITCHED====== \n"
cd ios
pod install
cd ../
echo -e "\n ======START DEPLOY====== \n"
npm run firebase_deploy_release_ios
echo -e "\n ============END DEPLOY=========== \n"
