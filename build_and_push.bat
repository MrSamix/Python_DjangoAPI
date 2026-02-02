@echo off

REM ==== WEB ====
cd react-ts
docker build -t python_django_react --build-arg VITE_API_URL=http://51.44.222.149:8361 .
docker tag python_django_react:latest mrsamix/python_django_react:latest
docker push mrsamix/python_django_react:latest

REM ==== API ====
cd ..\DjangoAPI\atbapi
docker build -t python_django_api .
docker tag python_django_api:latest mrsamix/python_django_api:latest
docker push mrsamix/python_django_api:latest

echo DONE
pause
