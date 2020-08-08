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


def query_database(body):
	#Connection
	connection = pymysql.connect(endpoint, user=username, passwd=password, db=database_name, charset='utf8mb4',
	                         cursorclass=pymysql.cursors.DictCursor)
	result= {"status": 'unsuccess'}
	
	productID= body['productID'] 
	product= body['product']
	amount= body['amount']
	
	try:
		with connection.cursor() as cursor:
			sql = "SELECT stock FROM products WHERE productID = %s AND product = %s"
			cursor.execute(sql, (int(productID), product) )
			connection.commit()
			result = cursor.fetchone()
	
	
			if(result is not None):
				stock = result['stock']
				print(stock)
				amount = int(amount)

				if(amount <= stock):
				  
					newStock= stock - amount;

					with connection.cursor() as cursor:
						try:
							cursor.execute("XA START 'transaction54091'")
							
							sql = "UPDATE products SET stock= %s WHERE productID = %s AND product = %s"
							val = (newStock, int(productID), product)
							cursor.execute(sql, val)
						
							cursor.execute("XA END 'transaction54091'")
						
							cursor.execute("XA PREPARE 'transaction54091'")
						
							cursor.execute("XA COMMIT 'transaction54091'")
						
							connection.commit()
						
							result= {"status": 'successful'}
						
						except:
							print("An error ocurred with the query")
							#cursor.execute("XA ROLLBACK 'transaction5409'") 
							#connection.commit()
							result= {"status": 'unsuccessful'}


				else:
				  print("Not enough stock")
				  result= {"status": 'unsuccessful'}

			else:
				print("That product does not exist")
				result= {"status": 'unsuccessful'}
		
	except pymysql.Error:
	  raise RuntimeError(
	"Cannot connect to database. "
	"Create a group of connection parameters under the heading "
	"[pandas] in your system's mysql default file, "
	"typically located at ~/.my.cnf or /etc/.my.cnf.")
	
	finally:
	  connection.close()
	
	return result
