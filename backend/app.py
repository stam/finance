# from flask import Flask, jsonify, request
# from settings import SETTINGS
# from db import db, Activity, Claim, Tag
# from datetime import datetime
# from flask_cors import CORS
# from dateutil import parser
# import pytz
# # import iso8601

# # basedir = os.path.abspath(os.path.dirname(__file__))
# app = Flask(__name__)
# CORS(app)

from settings import Settings
from flask import Flask, request, jsonify
import logging
from flask_sockets import Sockets
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object(Settings)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
sockets = Sockets(app)
db = SQLAlchemy(app)

from chimera.hub import Hub
from chimera.controller import RequestController
from src.models.data_import import Controller as DataImportController
hub = Hub()


@sockets.route('/api/')
def open_socket(ws):
    socket = hub.add(ws)
    while not socket.ws.closed:
        message = socket.ws.receive()
        if message:
            try:
                socket.handle(db, message)
            except Exception as e:
                logging.error(e, exc_info=True)


@app.route('/api/data_import/', methods=['POST'])
def data_import():
    rc = RequestController(hub, request)
    rc.body = rc._parse_body()

    if not rc.check_auth():
        res = jsonify({})
        res.status_code = 401
        return res

    user = rc.currentUser

    c = DataImportController(db, app, user, request)
    i = c.handle_fileupload()

    if not i:
        res = jsonify({})
        res.status_code = 500
        return res

    return jsonify(i.dump())

    # return rc.handle(db)
    # body = {
    #     'target': 'data_import',
    #     'type': 'save',
    # }
    # response = jsonify({})
    # response.status_code = 501
    # return response
