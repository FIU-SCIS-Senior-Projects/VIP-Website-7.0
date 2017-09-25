::@ECHO OFF

set "previous=%cd%"
set "code=%~dp0"

cd "%code%"
cmd /c npm install

cd "%code%deployment"
cmd /c npm install

cd "%previous%"

@ECHO ON