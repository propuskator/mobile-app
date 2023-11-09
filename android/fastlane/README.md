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
## Android
### android test
```
fastlane android test
```
Runs all the tests
### android bump_version_code
```
fastlane android bump_version_code
```
Increment version code
### android deploy
```
fastlane android deploy
```
Deploy a new version to the Google Play
### android icon
```
fastlane android icon
```
Make icons
### android send_message
```
fastlane android send_message
```
Send message to telegram group
### android firebase_deploy
```
fastlane android firebase_deploy
```
Deploy a new version to the Firebase
### android play_store_beta
```
fastlane android play_store_beta
```
Deploy a new version to the Google Play Beta

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
