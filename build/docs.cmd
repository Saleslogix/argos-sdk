@echo off

tools\jsduck\jsduck.exe --config=docs-config.json

if %errorlevel% neq 0 exit /b %errorlevel%