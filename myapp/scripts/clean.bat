@echo off

pushd .
cd ..

echo cleaning... dist build
rd dist /S /Q
rd build /S /Q

popd

pause
