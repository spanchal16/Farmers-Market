import json
import pymysql

print('Loading function')

#Configuration Values
endpoint = 'database-2.cso32duu5tdh.us-east-1.rds.amazonaws.com'
username = 'beltran'
password = 'B00847961'
database_name = 'cloud'


def lambda_handler(event, context):
	#1. query database
	print(event)
	body= json.loads(event['body'])
	print(body)
	jobsResponse= query_database(body)
	#jobsResponse= query_database()
	#print(jobsResponse)


	#2. Construct http response object
	responseObject = {}
	responseObject['statusCode'] = 200
	responseObject['headers'] = {}
	responseObject['headers']['Content-Type'] = 'application/json'
	#responseObject['body'] = json.dumps("Hello from lambda")
	responseObject['body'] = json.dumps(jobsResponse)

	#4. Return the response object
	print("Done!")
	return responseObject


def query_database():
	#Connection
	connection = pymysql.connect(endpoint, user=username, passwd=password, db=database_name, charset='utf8mb4',
	                         cursorclass=pymysql.cursors.DictCursor)
	result= []
	
	productID= body['productID'] 
  	product= body['product']

	
	try:
		with connection.cursor() as cursor:
			sql = "SELECT price FROM products WHERE productID=%s product=%s"
			val = (productID, product)
          	cursor.execute(sql, val)

			connection.commit()
			result = cursor.fetchall()
			
			for row in result:
				row["price"]= float(row["price"])
		
	except pymysql.Error:
	  raise RuntimeError(
	"Cannot connect to database. "
	"Create a group of connection parameters under the heading "
	"[pandas] in your system's mysql default file, "
	"typically located at ~/.my.cnf or /etc/.my.cnf.")
	
	finally:
	  connection.close()
	
	return result
