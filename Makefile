error: FORCE
	@echo "Please choose one of the following targets: build, package, install, post-install"
	@exit 2

# Empty rule to force other rules to be updated.
FORCE:



#### Build: main steps
package: FORCE build
	mv frontend/dist/ frontend-dist/
	gzip -k9 frontend-dist/*.html $(foreach ext,js css,frontend-dist/static/*.$(ext))
	rm -rf .git* frontend/
	tar czf ../finance-`cat branch.txt`-`cat version.txt`.tar.gz .

build: FORCE prepare frontend

prepare: FORCE prepare-version
frontend: FORCE frontend-npm frontend-build



#### Build: substeps
prepare-version: FORCE
	git describe --always --tags > version.txt
	git rev-parse --abbrev-ref HEAD > branch.txt

frontend-npm: FORCE
	rm -rf frontend/node_modules
	cd frontend; yarn

frontend-build: FORCE frontend-npm
	cd frontend; yarn run build



#### Install: main steps
install: FORCE backend-pip backend-migrations

backend-pip: FORCE
	cd backend; virtualenv venv
	cd backend; ./venv/bin/pip install -U -r packages.pip

backend-migrations: FORCE
	cd backend; ./venv/bin/python manage.py migrate

post-install:
	echo "Post install msg, nothing for now."
