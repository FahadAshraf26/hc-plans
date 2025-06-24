ifeq ($(CIRCLECI),yes)
  COMPOSEFILENAME=docker-compose.ci.yml
else
  COMPOSEFILENAME=docker-compose.yml
endif


all: dev migrate logs

run-test: migrate tests

dev:
	docker-compose -f ./ops/docker/${COMPOSEFILENAME} up
	sleep 5
migrate:
	docker-compose -f ./ops/docker/${COMPOSEFILENAME} exec -T api-server npx sequelize-cli db:migrate

tests:
	docker-compose -f ./ops/docker/${COMPOSEFILENAME} exec -T api-server sh -c "npm test"

build:
	docker-compose -f ./ops/docker/${COMPOSEFILENAME}  build

kill:
	docker-compose -f ./ops/docker/${COMPOSEFILENAME}  kill

clean:
	docker-compose -f ./ops/docker/${COMPOSEFILENAME}  kill
	docker-compose -f ./ops/docker/${COMPOSEFILENAME}  rm -f
	docker-compose -f ./ops/docker/${COMPOSEFILENAME}  down --remove-orphans

logs:
	docker-compose -f ./ops/docker/${COMPOSEFILENAME} logs -f

ps:
	docker-compose -f ./ops/docker/${COMPOSEFILENAME} ps

up:
	docker-compose -f ./ops/docker/${COMPOSEFILENAME} up -d
	sleep 20
down:
	docker-compose -f ./ops/docker/${COMPOSEFILENAME} down

copy-coverage:
	docker cp docker_api-server_1:/miventures-api/coverage ~/project/coverage

attach:
	docker-compose -f ./ops/docker/${COMPOSEFILENAME} exec api-server sh


