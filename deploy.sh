eval $(docker-machine env jasper-wtf)

docker-compose --env-file .env.production -f docker-compose.prod.yml up -d
