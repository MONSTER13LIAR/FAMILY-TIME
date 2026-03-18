@echo off
set "NODE_BIN=C:\Users\HP\AppData\Local\Temp\node_extracted\node-v24.14.0-win-x64"
set "PATH=%NODE_BIN%;%PATH%"
echo Starting Family Time UI...
pushd "%~dp0"
"%NODE_BIN%\node.exe" ".\node_modules\vite\bin\vite.js" --host 127.0.0.1
popd
pause
