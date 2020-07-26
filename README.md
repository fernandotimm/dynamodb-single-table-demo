#### Summary
This experiment was inspired on the talk about Data modeling with Amazon DynamoDB on AWS re:Invent 2019 (https://youtu.be/DIQVJqiSUkE). It uses a **Single Table** on DynamoDB to store User Profiles and Places owned by users.
### 
The target was to use the Query() function instead of the Scan() function as Scan() could be expensive at scale and should be avoided.
### 
The target of my experiment was to retrieve all PROFILES and PLACES from **all users** on the Single Table using the **Query** function.

#### How to run
###### Install dependencies:
```
$ yarn
```
or
```
$ npm install
```

###### Run a local DynamoDB instance using the docker-compose file
```
$ docker-compose -f docker-compose.yaml up -d
```

###### Run the simple test to insert fake data and to run the Query functions on the Single Table to list the data
```
$ yarn test
```
or
```
$ npm run test
```
### 
After running the script, it should be possible to see on the console the output after adding a place and a profile for a specific user, and also retrieving the data for that same specific user from DynamoDB.
### 
You can enter http://localhost:8000/shell/ (using DynamoDB local) to check the table schema and items. Copy the script
on dynamodb-local-shell-script.js, paste into the shell and execute.