import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

client = MongoClient(MONGODB_URI)
db = client['fitbro']

users_collection = db['users']
workouts_collection = db['workouts']