# finance

Webapp for keeping track of finances.

## Getting started

```
docker-compose up -d
docker exec -it finance_web_1 python manage.py migrate
docker exec -it finance_web_1 python manage.py createsuperuser
cd frontend
yarn && yarn start
```
