import sys
sys.path.append("/home/fabricio/Desktop/proyectosMini/loginDemo/backend/src/")

from app import app

from werkzeug.exceptions import *


@app.errorhandler(NotFound)
def handle_bad_request(e):
    return 'bad requestsdf!', 400