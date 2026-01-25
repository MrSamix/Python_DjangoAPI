## Docker command
```
git clone https://github.com/MrSamix/Python_DjangoAPI
cd DjangoAPI
cd atbapi
docker build -t my-django-app .
docker run -p 8000:8000 my-django-app
```

## Docker compose
```
docker compose up -d
docker exec -it <container_name_or_id> /bin/bash
python manage.py migrate
exit

git pull

docker compose up -d

docker exec -it front /bin/sh

exit
```

## Stop all containers
```
docker compose down --volumes --rmi all
```

## Build FrontEnd
```
docker build \
    -t front
    --build-arg VITE_API_URL=${VITE_API_URL} \
    ./react-ts
```

## Build Backend
```
docker build -t django "./DjangoAPI/atbapi"
```

# Білдимо локально. Закидаємо образи на docker hub
# Буде працювати команда docker compose pull
# Піднімати образи за допомгою docker compose up -d