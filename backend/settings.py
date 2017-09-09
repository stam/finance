import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(os.environ.get('CY_ENV_FILE', find_dotenv()))


class Settings(object):
    DEBUG = os.environ.get('CY_DEBUG')
    CSRF_ENABLED = True
    SECRET_KEY = os.environ.get('CY_SECRET_KEY')
    UPLOAD_FOLDER = './uploads'
    SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://' + os.environ.get('CY_DB_USER') + '@/' + os.environ.get('CY_DB_NAME')
