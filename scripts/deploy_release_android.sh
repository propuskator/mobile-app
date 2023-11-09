#!/bin/bash

echo "============DEPLOY ANDROID============"
echo "======MODULES INSTALL START======"
npm ci
echo "======MODULES INSTALL END======"
. scripts/switch.sh prod
echo "======CONFIG_SWITCHED======"
echo "======START DEPLOY======"
npm run firebase_deploy_release_android
echo "============END DEPLOY============"
