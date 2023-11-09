# React Native boilerplate

React Native starter kit for fast project initialization.

## Getting started
* ```git clone```
* ```rm -rf .git && git init```
* ```npm i && cd ios && pod install```
* ```npm run rename <NEW_PROJECT_NAME>```

## Configuration
This bolerplate already includes [react-native-config](https://github.com/luggit/react-native-config) for configuration management. All variables which are changing from stage to stage(apiPrefix, awesomeKey, etc.) you should put in ```.env``` file. Therefore you will have access to them in different parts of your app (see docs for examples).

Another idea is to store all credentials and files(.keystore, google-services.json, etc.) for different stages in separate repos. To fetch it use ```npm run create_stage <STAGE_NAME> <URL_TO_GIT_REPO>```. Make sure you have access to this repo.

As a result we have such file strucrute:
```
project
│
└─── config
│   └─── dev
│   │   └─── .env
│   │   └─── my-release-key.keystore
│   │   └─── ...
│   └─── prod
│   │   └─── .env
│   │   └─── my-release-key.keystore
│   │   └─── ...
...
```
To switch between stages use ```npm run switch <STAGE_NAME>```. This script just replaces your ```/.env``` with ```/config/<STAGE_NAME>/.env```, so feel free to edit it for example to replace ```google-services.json```. You may find source of this script in ```/scripts/switch.sh```.

## NPM scripts
* ```start``` - start metro bundler
* ```lint``` - check source code with ESLint
* ```firebase_deploy_android``` - create new build for Android and push in to Firebase (without increment versionCode)
* ```firebase_deploy_ios``` - create new build for iOS and push in to Firebase (without increment build number)
* ```switch``` - switch between stages
* ```update_icons``` - update application icons in your project for both Android and iOS 
* ```rename``` - rename react native project
* ```build++``` - increment build value in ```package.json```
* ```create_stage``` - fetch stage credentials from git repo
* ```generate_keystore``` - generate .keystore file
* ```firebase_deploy``` - build and push new builds for both Android and iOS and push them to Firebase (with increment)
* ```create_component``` - creates a component folder at path (as 1st parameter) and name (as 2nd parameter)
* ```validate_envfile``` - validates .env file with rules specified in config/rules.json. [LIVR](http://livr-spec.org/) is used
* ```android``` - validates .env file and runs `react-native run-android`
* ```ios``` - validates .env file and runs `react-native run-ios`
* ```generate_langs``` - creates langs dir, if it doesn't exist, creates list of langs with 1 item (english), runs commands extract_lang, merge_po_files, po2json
* ```extract_messages``` - goes through all files in src/ and adds key strings to messages.pot file
* ```merge_po_files``` - creates/merges lang po files (e.g. en.po, ua.po) with key strings from messages.pot
* ```po2json``` - converts lang po files to json to use translations in app
* ```create_ios_app``` - creates a new iOS app on Apple Development and iTunesConnect
* ```firebase_deploy_release_android```  -  create new release build for Android and push in to Firebase 
* ```firebase_deploy_release_ios``` -  create new release build for IOS and push in to Testflight
* ```deploy_android```  -  switch to prod config, and push  new release android build to Firebase
* ```deploy_ios```  -  switch to prod config, and push  new release ios build to Testflight
* ```deploy_apps```  -  create ios and android release builds 


## Fields
* "version" - current dev version ,
* "ios_version" - version for testflight build ,
* "android_version" - vesion for play market build ,
* "build" - release build number 