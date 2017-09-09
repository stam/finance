#!/usr/bin/env python3
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from app import app, db
from werkzeug.serving import run_with_reloader
import logging

migrate = Migrate(app, db)
manager = Manager(app)

manager.add_command('db', MigrateCommand)


@manager.command
def runserver():
    from gevent import pywsgi, monkey
    from geventwebsocket.handler import WebSocketHandler
    server = pywsgi.WSGIServer(('', 5000), app, handler_class=WebSocketHandler)

    if app.debug:
        logging.basicConfig(format='%(asctime)s %(message)s')
        logger = logging.getLogger()
        logger.setLevel(logging.DEBUG)
        monkey.patch_all()
        run_with_reloader(server.serve_forever)
    else:
        server.serve_forever()


@manager.command
def test():
    import tests
    tests.run()


if __name__ == '__main__':
    manager.run()
