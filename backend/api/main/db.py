from pymongo import MongoClient
from api.main.config import MONGO_CONNECTION_URL, DB_NAME


def get_database(connection_url, database_name):
    client = MongoClient(connection_url)
    database = client.get_database(database_name)
    return database


DB = get_database(MONGO_CONNECTION_URL, DB_NAME)
