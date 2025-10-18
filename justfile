# Shows help
default:
    @just --list --justfile {{ justfile() }}

# build the app
build: __install
    @yarn run build --base=./

update:
    yarn upgrade-interactive --latest
    @echo "Cleaning up node_modules and reinstalling to avoid potential issues..."
    -rm -rf node_modules
    -rm yarn.lock
    yarn install --network-timeout=300000

# run the app in a development mode
run:
    @yarn start --host 0.0.0.0

# run dev stack and start the app in a development mode
run-dev:
    @echo "Pulling latest docker images..."
    @docker-compose -f docker-compose-dev.yml pull
    @echo "Starting the database..."
    @docker-compose -f docker-compose-dev.yml up -d postgres
    @echo "Starting Synapse..."
    @docker-compose -f docker-compose-dev.yml up -d synapse
    @echo "Starting Matrix Authenitcation Service..."
    @docker-compose -f docker-compose-dev.yml up -d mas
    @echo "Starting nginx reverse proxy (Synapse and MAS)..."
    @docker-compose -f docker-compose-dev.yml up -d nginx
    @echo "Starting Element Web..."
    @docker-compose -f docker-compose-dev.yml up -d element
    @echo "Ensure admin user is registered..."
    @docker-compose -f docker-compose-dev.yml exec mas mas-cli manage register-user --yes --admin -p admin admin || true
    @echo "Starting the app..."
    @yarn start --host 0.0.0.0

logs-dev *flags:
    @docker-compose -f docker-compose-dev.yml logs -f {{ flags }}

# stop the dev stack
stop-dev:
    @docker-compose -f docker-compose-dev.yml down

# register a user in the dev stack
register-user localpart password *admin:
    docker-compose -f docker-compose-dev.yml exec mas mas-cli manage register-user --yes {{ if admin =="1" {"--admin"} else {"--no-admin"} }} -p {{ password }} {{ localpart }}

# run yarn {fix,lint,test} commands
test:
    @-yarn run fix
    @-yarn run lint
    @-yarn run test

# run the app in a production mode
run-prod: build
    @python -m http.server -d dist 1313

# install the project
__install:
    @yarn install --immutable --network-timeout=300000
