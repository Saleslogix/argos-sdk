@echo off

if exist deploy (
	rmdir deploy /S /Q
)

mkdir deploy\content\javascript
mkdir deploy\content\javascript\cultures
mkdir deploy\content\images
mkdir deploy\content\css\themes\crm
mkdir deploy\content\dojo\dojo\selector
mkdir deploy\content\dojo\dijit
mkdir deploy\content\dojo\dojox

call grunt clean:css clean:js less
call yarn run build

xcopy node_modules\babel-polyfill\dist\polyfill.min.js deps\babel-polyfill\ /E /Y
xcopy node_modules\moment\min\moment-with-locales.js deps\moment\ /E /Y
xcopy node_modules\rx-lite\rx.lite.js deps\rx-lite\ /E /Y
xcopy node_modules\@infor\icrm-js-common\dist\bundles\common.bundle.js deps\icrm-js-common\ /E /Y
xcopy node_modules\@infor\icrm-js-customization\dist\bundles\customization.bundle.js deps\icrm-js-customization\ /E /Y
xcopy node_modules\@infor\icrm-js-services\dist\bundles\icrm-js-services.js deps\icrm-js-services\ /E /Y
xcopy node_modules\redux\dist\redux.min.js deps\redux\ /E /Y
xcopy node_modules\@infor\sohoxi\js\vendor\d3.js deps\d3\ /E /Y
xcopy node_modules\jquery\dist\jquery.js deps\jquery\ /E /Y
xcopy node_modules\@infor\sohoxi\dist\js\sohoxi.js deps\sohoxijs\ /E /Y
xcopy node_modules\@infor\sohoxi\dist\css\*.css deps\sohoxicss\ /E /Y
xcopy node_modules\@infor\sohoxi\dist\js\cultures\*.js deps\sohoxicultures\ /E /Y

REM .NET Build Tool
tools\JsBit\jsbit.exe -p "build/release.jsb2" -d "."

REM Java Build Tool
REM %JAVA_HOME%\bin\java -Dfile.encoding=UTF-8 -jar "tools/JSBuilder/JSBuilder2.jar" -v -p "build/release.jsb2" -d "."

if %errorlevel% neq 0 exit /b %errorlevel%
