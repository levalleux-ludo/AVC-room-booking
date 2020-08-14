@echo off
REM for /F "usebackq tokens=1,2,3 delims= " %%I in (%USERPROFILE%\.aws\credentials) do @if %%J=== @set "VAR=%%I" && firebase functions:config:set "%VAR:aws_=aws_s3_avc_%=%%K";

set APPNAME=avc-room-booking-api

SETLOCAL EnableDelayedExpansion
set variables=
for /F "usebackq tokens=1,2,3 delims= " %%I in (%USERPROFILE%\.aws\credentials) do @if %%J=== @set "VAR=%%I" && set "variables=!variables! !VAR:aws_=aws_s3_avc_!=%%K"
for /F "usebackq tokens=1,* delims==" %%I in (%~dp0\.env.prod) do @set "VAR=%%I" && set "variables=!variables! !VAR!=%%J"

rem set "variables=!variables! upload_folder=/tmp/uploads"

echo on
heroku config:set -a %APPNAME% %variables%
