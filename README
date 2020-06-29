This project was created for the purpose of showcasing ~~a bug~~ to the Dynamoose team.
~~It contains a simple test to help reproducing a probable bug on the Query function.~~

The idea is to use the Query() function instead of the Scan() function in order to follow the recommendations of DB modeling as seen on AWS re:Invent 2019. 
Here's the complete video of the talk: https://youtu.be/DIQVJqiSUkE


Install dependencies:
$ yarn
or
$ npm install

Run a local DynamoDB instance using the docker-compose file
$ docker-compose -f docker-compose.yaml up -d

Run the simple test to insert fake data and to run the query functions to list them
$ yarn test
or
$ npm run test

~~You should see the error:~~
~~"Index can't be found for query."~~


UPDATE - June 29th 2020:
https://github.com/fernandotimm/dynamoose-query-issue/commit/fef1b0178902930c218bc377963d3b916ed663f7
After alignment with the Dynamoose team, it was discovered that it was actually not a bug, but a misunderstanding from my side about how DynamoDB works with the Query function + the partition key.
The Query function should work with the EQ (is equal to) operator when filtering via partition key (pk).
Nevertheless, it should be possible to use the beginWith operator with the Sort Key (sk).