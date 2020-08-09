import json
import pymysql
from decimal import Decimal

print('Loading function')

#Configuration Values
endpoint = 'database-2.cso32duu5tdh.us-east-1.rds.amazonaws.com'
username = 'beltran'
password = 'B00847961'
database_name = 'cloud'


def default(obj):
    if isinstance(obj, Decimal):
        return str(obj)
    raise TypeError("Object of type '%s' is not JSON serializable" % type(obj).__name__)


def lambda_handler(event, context):
	#1. query database
	body= json.loads(event['body'])
	jobsResponse= query_database(body)


	#2. Construct http response object
	responseObject = {}
	responseObject['statusCode'] = 200
	responseObject['headers'] = {}
	responseObject['headers']['Content-Type'] = 'application/json'
	responseObject['body'] = json.dumps(jobsResponse, default=default)

	#4. Return the response object
	print("Done!")
	return responseObject


def query_database(body):
	#Connection
	connection = pymysql.connect(endpoint, user=username, passwd=password, db=database_name, charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)
	productID = body['productID']

	result= []
	try:
	    with connection.cursor() as cursor:
	        # Read a single record
	        sql = "SELECT * FROM products WHERE productID = %s"
	        cursor.execute(sql, (int(productID)) )
	        result = cursor.fetchone()

	        if(result is None):
	        	result= {"status": 'unsuccess', "code": '400', "message": "Product ID: " + productID + " does not exist, can't retrieve data."}
				
	except pymysql.Error:
	    raise RuntimeError(
	"Cannot connect to database. "
	"Create a group of connection parameters under the heading "
	"[pandas] in your system's mysql default file, "
	"typically located at ~/.my.cnf or /etc/.my.cnf.")

	finally:
	    connection.close()
	
	return result