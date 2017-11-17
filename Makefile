error: FORCE
	@echo "Please choose one of the following targets: build"
	@exit 2

# Empty rule to force other rules to be updated.
FORCE:



#### Build: main steps
build: FORCE backend frontend

backend: FORCE backend-pip backend-migrations
frontend: FORCE frontend-npm frontend-build
backend-dev: FORCE backend-pip backend-migrations backend-dev-server
frontend-dev: FORCE frontend-dev-npm frontend-dev-server

#### Build: substeps
backend-pip: FORCE
	cd backend; ./venv/bin/pip install -U -r packages.pip

backend-migrations: FORCE
	cd backend; ./venv/bin/python manage.py migrate

backend-dev-server:
	cd backend; ./venv/bin/python manage.py runserver

frontend-npm: FORCE
	rm -rf frontend/node_modules
	cd frontend; yarn

frontend-build: FORCE frontend-npm
	cd frontend; yarn run build

frontend-dev-npm: FORCE
	# This differs with `frontend-npm` because it does not remove node_modules, this needs to be quick
	cd frontend; yarn

frontend-dev-server:
	cd frontend; yarn start
