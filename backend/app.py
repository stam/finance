from settings import Settings
from archon.app import create_app
from src.models import *  # noqa

app, db = create_app(Settings)


# @app.route('/api/data_import/', methods=['POST'])
# def data_import():
#     rc = RequestController(app.hub, request)
#     rc.body = rc._parse_body()

#     if not rc.check_auth():
#         res = jsonify({})
#         res.status_code = 401
#         return res

#     user = rc.currentUser

#     c = DataImportController(db, app, user, request)
#     i = c.handle_fileupload()

#     if not i:
#         res = jsonify({})
#         res.status_code = 500
#         return res

#     return jsonify(i.dump())
