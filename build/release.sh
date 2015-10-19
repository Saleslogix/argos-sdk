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

grunt clean:css
grunt clean:js
grunt babel
grunt less

# Java Build Tool
#java -Dfile.encoding=UTF-8 -jar "tools/JSBuilder/JSBuilder2.jar" --verbose --projectFile "build/release.jsb2" --homeDir "."

# Requires mono
mono tools/JsBit/jsbit.exe -p "build/release.jsb2" -d "."
