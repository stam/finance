# finance

Webapp for keeping track of finances.

## Getting started

```
docker-compose up -d
docker exec -it finance_web_1 python manage.py migrate
docker exec -it finance_web_1 python manage.py createsuperuser
cd frontend-v2
yarn && yarn start
```

## Developing

Changing the datamodel:

- Make changes in models
- When adding new models, make sure to add them to models/**init**
- Generate migrations: `docker exec -it finance_web_1 python manage.py makemigrations`
- Run migrations: `docker exec -it finance_web_1 python manage.py migrate`
- Update views where necessary
