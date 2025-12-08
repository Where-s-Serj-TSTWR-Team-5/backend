# Plants

1. Install docker to your system
2. Run `docker compose up` and you are good to go

## Modules

We use ES6 module system to import and export modules.

## Variables.env

We save credentials to other services in a `variables.env` file. This file is included in this template. However, it is common use not to include it in a public repository. There are some default key value pairs included to demonstrate its working.

## Ports

- Apigateway: microservice for the API Gateway - running on port:3011
- Plants: microservice for the Plants resource - running on port:3020
- Events: microservice for the Events resource - running on port:3021
- Rewards: microservice for the Rewards resource - running on port:3022
