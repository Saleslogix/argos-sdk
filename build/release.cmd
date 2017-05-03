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
xcopy node_modules\redux\dist\redux.min.js deps\redux\ /E /Y

REM .NET Build Tool
tools\JsBit\jsbit.exe -p "build/release.jsb2" -d "."

REM Java Build Tool
REM %JAVA_HOME%\bin\java -Dfile.encoding=UTF-8 -jar "tools/JSBuilder/JSBuilder2.jar" -v -p "build/release.jsb2" -d "."

if %errorlevel% neq 0 exit /b %errorlevel%
