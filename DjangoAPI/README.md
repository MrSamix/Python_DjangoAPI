# Simple REST API

```
py --version
py -m venv .venv
```

## Activate venv

```
.venv\Scripts\activate.bat
python.exe -m pip install --upgrade pip
py -m pip install django

python -m django --version

django-admin startproject atbapi

cd atbapi

py manage.py runserver 4099

pip freeze > requirements.txt
```

## Install Postgres

```
pip install psycopg2-binary
py manage.py migrate
```

## Add CustomUser

```
py manage.py startapp users

pip install -r requirements.txt

pip install Pillow

py manage.py makemigrations users
py manage.py migrate

py manage.py runserver 4099
```

## Install Swagger

```
pip install djangorestframework # swagger
pip install drf-spectacular # swagger
```

## Install JWT & Cors

```
pip install djangorestframework-simplejwt
pip install django-cors-headers
```

## Docker command

```
git clone https://github.com/novakvova/PythonDjangoAppNPD421.git
cd Django API
cd atbapi
docker build -t my-django-app .
docker run -p 8000:8000 my-django-app
```
