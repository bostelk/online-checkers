@echo off

echo building...
cmd /c build-prod.bat --no-input

pushd .
cd ..

echo:
echo archiving...
echo:

mkdir build
powershell -Command "& {Compress-Archive -Path dist\* -DestinationPath build\checkers-$(get-date -f MM-dd-yyyy)}"

popd

:: Check if the switch is provided (e.g., --no-input)
if "%1"=="--no-input" goto end_script

pause

:end_script
