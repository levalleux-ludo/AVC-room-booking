pushd "%~dp0.."
pause
cd backend
docker build -t local/avc/backend .
pause
popd