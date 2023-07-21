## Run an gRPC-Web Echo example

This page will show you how to quickly build and run an end-to-end Echo
example. The example has 3 key components:

 - Front-end JS client (web-client)
 - Envoy proxy (docker)
 - gRPC backend server (node-server)

From the repo root directory:

## Start Envoy proxy

```
docker-compose up -d
```



## Start gRPC backend server

```
cd node-server
npm install
npm run start
```



## Start Front-end JS client

```
cd web-client
npm install
npm run start
```

Visit http://localhost:8088/



## Original project

https://github.com/grpc/grpc-web/tree/master/net/grpc/gateway/examples/echo
