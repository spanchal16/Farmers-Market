import json
import pymysql
from decimal import Decimal
from datetime import date, datetime

print('Loading function')

#Configuration Values
endpoint = 'database-2.cso32duu5tdh.us-east-1.rds.amazonaws.com'
username = 'beltran'
password = 'B00847961'
database_name = 'cloud'


def default(obj):
    if isinstance(obj, Decimal):
        return str(obj)
    if isinstance(obj, datetime):
        return str(obj)
    raise TypeError("Object of type '%s' is not JSON serializable" % type(obj).__name__)


def lambda_handler(event, context):
	#1. query database
	jobsResponse= query_database()


	#2. Construct http response object
	responseObject = {}
	responseObject['statusCode'] = 200
	responseObject['headers'] = {}
	responseObject['headers']['Content-Type'] = 'application/json'
	responseObject['body'] = json.dumps(jobsResponse, default=default)

	#4. Return the response object
	print("Done!")
	return responseObject


def query_database():
	#Connection
	connection = pymysql.connect(endpoint, user=username, passwd=password, db=database_name, charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)
	result= []
	try:
	    with connection.cursor() as cursor:
	        # Read a single record
	        sql = "SELECT * FROM orders"
	        cursor.execute(sql)
	        result = cursor.fetchall()
	        print(result)
	        print(type(result))

	finally:
	    connection.close()
	
	return result