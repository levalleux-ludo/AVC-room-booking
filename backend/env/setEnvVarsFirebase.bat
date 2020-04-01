@echo off
REM for /F "usebackq tokens=1,2,3 delims= " %%I in (%USERPROFILE%\.aws\credentials) do @if %%J=== @set "VAR=%%I" && firebase functions:config:set "env.%VAR:aws_=aws_s3_avc_%=%%K";

SETLOCAL EnableDelayedExpansion
set variables=
for /F "usebackq tokens=1,2,3 delims= " %%I in (%USERPROFILE%\.aws\credentials) do @if %%J=== @set "VAR=%%I" && set "variables=!variables! env.!VAR:aws_=aws_s3_avc_!=%%K"
for /F "usebackq tokens=1,* delims==" %%I in (%~dp0\.env.prod) do @set "VAR=%%I" && set "variables=!variables! env.!VAR!=%%J"

rem set "variables=!variables! env.upload_folder=/tmp/uploads"

echo on
firebase functions:config:set %variables%
