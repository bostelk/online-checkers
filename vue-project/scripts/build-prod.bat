@echo off

pushd .
cd ..

npm run build

popd

:: Check if the switch is provided (e.g., --no-input)
if "%1"=="--no-input" goto end_script

pause

:end_script
