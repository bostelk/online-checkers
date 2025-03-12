@echo off

pushd .
cd ..

cmd /c npm run build
copy package.json dist
copy package-lock.json dist

popd

:: Check if the switch is provided (e.g., --no-input)
if "%1"=="--no-input" goto end_script

pause

:end_script
