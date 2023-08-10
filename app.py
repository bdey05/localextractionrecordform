# Import libraries
import os
import datetime
from flask import Flask, g, render_template, request, Response
import mysql.connector
import sys

# Database configuration
config = {
    'database' : {
        'user' : 'dbmaster',
        #'password' : os.environ.get('MYSQL_PASSWORD'),
        'password': 'test123',
        #'host': 'db',
        'host' : 'localhost',
        'database' : 'extractionrecords' 
    }
}

# Instantiate app
app = Flask(__name__)

# Decorator - Initialize database before first request
@app.before_first_request
def before_first_request(): 

    # Attempt connection
    try:
        # Make connection
        connection = create_connection(**config['database'])
        connection.commit()

    # Error
    except(Exception) as error:
        return error

@app.before_request
def before_request():
    g.connection = create_connection(**config["database"])
    g.cursor = g.connection.cursor()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/form/')
def create():
    return render_template('form.html')

@app.route('/insert/', methods=['POST'])
def insert():
    if (request.method == "POST"):
        print(request.json, file=sys.stderr)
        
        test = "INSERT INTO Datablock (id, addition_date, entry_author) VALUES (%s, %s, %s)"

        try:
            g.cursor.execute(test, [2, 2023, request.json["extractants"][0]["identity"]])
            g.connection.commit()
            g.cursor.close()
            g.connection.close()
            print('Data Insert Succesful', file=sys.stderr)

        except Exception as e:
            g.connection.rollback()
            print('Data Insert Failed', e, file=sys.stderr)
    return Response(status=204)

'''
TESTING PURPOSES
'''
@app.route('/test/')
def test():
    vals = {
        'id' : 1,
        'date' : 2023
    }
    query = f'INSERT INTO Datablock (id, addition_date) VALUES ({vals["id"]}, {vals["date"]});'
    
    # Insertion attempt
    try:
        g.cursor.execute(query)
        g.connection.commit()
        g.cursor.close()
        g.connection.close()
        return "Data inserted successfully."

    # Error
    except Exception as e:
        g.connection.rollback()
        return f"Error: {e}"

# Function to make connection
def create_connection(host=None, user=None, password=None, database=None):

    # Return connection
    return mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database
        )

if __name__ == '__main__':
    
    # Run the Flask app using the development server
    #app.run(host='0.0.0.0', port=5000)
    app.run(debug=True)
