@echo off

if exist dist (
	rmdir dist /S /Q
)

mkdir dist\localization

REM .NET Build Tool
tools\JsBit\jsbit.exe -p "build/release.jsb2" -d "."

REM Java Build Tool
REM %JAVA_HOME%\bin\java -Dfile.encoding=UTF-8 -jar "tools/JSBuilder/JSBuilder2.jar" -v -p "build/release.jsb2" -d "."

if %errorlevel% neq 0 exit /b %errorlevel%
