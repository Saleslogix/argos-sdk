#!/bin/sh

if [ -d "deploy" ]; then
    rm -rf deploy
fi

mkdir -p deploy/localization/locales/argos
mkdir -p deploy/content/javascript
mkdir -p deploy/content/images
mkdir -p deploy/content/css/themes/fonts
mkdir -p deploy/content/dojo/dojo
mkdir -p deploy/content/dojo/selector
mkdir -p deploy/content/dijit
mkdir -p deploy/content/dojox

yarn
grunt clean:css
grunt clean:js
grunt less
yarn run build

# Requires mono
mono tools/JsBit/jsbit.exe -p "build/release.jsb2" -d "."
