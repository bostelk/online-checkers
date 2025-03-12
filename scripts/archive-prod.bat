@echo off

pushd .
cd ..

mkdir build

pushd .
cd myapp\scripts
cmd /c archive-prod.bat --no-input
xcopy ..\build ..\..\build /Y
popd

pushd .
cd vue-project\scripts
cmd /c archive-prod.bat --no-input
xcopy ..\build ..\..\build /Y
popd

:: Check if the switch is provided (e.g., --no-input)
if "%1"=="--no-input" goto end_script

pause

:end_script
