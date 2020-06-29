####Summary
This project was created for the purpose of showcasing ~~a bug~~ to the Dynamoose team.
~~It contains a simple test to help reproducing a probable bug on the Query function.~~

The idea is to use the Query() function instead of the Scan() function in order to follow the recommendations of DB modeling as seen on AWS re:Invent 2019. 
Here's the complete video of the talk: https://youtu.be/DIQVJqiSUkE

####How to run
######Install dependencies:
```
$ yarn
```
or
```
$ npm install
```

######Run a local DynamoDB instance using the docker-compose file
```
$ docker-compose -f docker-compose.yaml up -d
```

######Run the simple test to insert fake data and to run the query functions to list them
```
$ yarn test
```
or
```
$ npm run test
```
###

~~On the console, the following error should be seen:~~
~~"Index can't be found for query."~~
###
On the console, it should be possible to see the output after adding a place and a profile for a specific user, and also retrieving the data for that same specific user from DynamoDB.

###
######UPDATE - June 29th 2020:
After alignment with the Dynamoose team, it was discovered that it was actually not a bug, but a misunderstanding from my side about how DynamoDB works with the Query function + the partition key.
The Query function should work with the EQ (is equal to) operator when filtering via partition key (pk).
Nevertheless, it should be possible to use the beginWith operator with the Sort Key (sk).
Here's the commit where I fixed it:
https://github.com/fernandotimm/dynamoose-query-issue/commit/fef1b0178902930c218bc377963d3b916ed663f7
####Open TODO
The target of my experiment was to retrieve all PROFILES and PLACES from **all users** using the **Query** function. 
Even knowing that it should be accomplished by using the Scan function, I will try once more with the Query function on this Single Table modeling and will share the final approach I used for retrieving the data I'm looking for.
It's important to say that I'm new to DynamoDB and Dynamoose, so if you have some input/suggestions, feel free to reach out. ;)