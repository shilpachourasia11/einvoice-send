# einvoice-send

### Service create

```
docker service create --name einvoice-send --log-driver gelf --log-opt gelf-address=udp://10.0.0.12:12201 --log-opt tag="einvoice-send" --publish mode=host,target=3007,published=3007 --env CONSUL_HOST=172.17.0.1 --host consul:172.17.0.1 --env SERVICE_NAME=einvoice-send --env NODE_ENV=development --env EXTERNAL_HOST=52.233.155.169 --env EXTERNAL_PORT=80 --env NGINX_PORT=8080 --env SERVICE_3007_CHECK_HTTP=/api/health/check --env SERVICE_3007_CHECK_INTERVAL=15s --env SERVICE_3007_CHECK_TIMEOUT=3s opuscapita/einvoice-send:dev
```
