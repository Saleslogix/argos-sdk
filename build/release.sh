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

mkdir deps
rsync -av node_modules/babel-polyfill/dist/polyfill.min.js deps/babel-polyfill/
rsync -av node_modules/moment/min/moment-with-locales.js deps/moment/
rsync -av node_modules/rx-lite/rx.lite.js deps/rx-lite/
rsync -av node_modules/@infor/icrm-js-common/dist/bundles/common.bundle.js deps/icrm-js-common/
rsync -av node_modules/@infor/icrm-js-customization/dist/bundles/customization.bundle.js deps/icrm-js-customization/
rsync -av node_modules/@infor/icrm-js-services/dist/bundles/icrm-js-services.js deps/icrm-js-services/
rsync -av node_modules/redux/dist/redux.min.js deps/redux/
rsync -av node_modules/jquery/dist/jquery.js deps/jquery/
rsync -av node_modules/@infor/sohoxi/dist/js/sohoxi.js deps/sohoxijs/
rsync -av node_modules/@infor/sohoxi/dist/css/*.css deps/sohoxicss/
rsync -av node_modules/@infor/sohoxi/dist/js/cultures/*.js deps/sohoxicultures/

# Requires mono
mono tools/JsBit/jsbit.exe -p "build/release.jsb2" -d "."
