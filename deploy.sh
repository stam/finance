set -e

docker context use finance-prod
cd frontend-v2 && yarn && yarn build
cd ..
docker-compose --env-file .env.production -f docker-compose.prod.yml up -d --build
docker exec -it finance_web_1 python manage.py migrate
docker exec -it nginx nginx -s reload
