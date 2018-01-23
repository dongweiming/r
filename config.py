# coding=utf-8
try:
    from dae.api import permdir
    from dae.api.mysql import get_mysql_conn_params

    _SQL_PARAMS = get_mysql_conn_params()
    UPLOAD_FOLDER = permdir.get_permdir()
except ImportError:
    _SQL_PARAMS = {
        'passwd': '',
        'host': '127.0.0.1',
        'db': 'p',
        'port': 3306,
        'user': 'root',
        }
    UPLOAD_FOLDER = 'permdir'

DEBUG = True
MAX_CONTENT_LENGTH = 100 * 1024 * 1024
SQLALCHEMY_DATABASE_URI = "mysql://%s:%s@%s:%s/%s" % (
    _SQL_PARAMS['user'], _SQL_PARAMS['passwd'], _SQL_PARAMS['host'],
    _SQL_PARAMS['port'], _SQL_PARAMS['db'])

try:
    from local_config import *  # noqa
except Exception:
    pass
