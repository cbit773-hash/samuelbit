@echo off
set "NODE_DIR=%LOCALAPPDATA%\nodejs"
if not exist "%NODE_DIR%\npm.cmd" (
  echo Node.js no encontrado en %NODE_DIR%
  echo Ejecuta de nuevo la instalacion o reinicia Cursor.
  exit /b 1
)
set "PATH=%NODE_DIR%;%PATH%"
cd /d "%~dp0"
"%NODE_DIR%\npm.cmd" run dev
