fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
## iOS
### ios firebase_deploy
```
fastlane ios firebase_deploy
```
Build App and push a it to the Firebase
### ios sync_testflight_version
```
fastlane ios sync_testflight_version
```
Sync version with package.json
### ios upload_to_tf
```
fastlane ios upload_to_tf
```
Push a new release build to testflight
### ios icon
```
fastlane ios icon
```
Make icons
### ios sync_version
```
fastlane ios sync_version
```
Sync version with package.json
### ios send_message
```
fastlane ios send_message
```
Send message to telegram group
### ios create_ios_app
```
fastlane ios create_ios_app
```
Create iOS app

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
