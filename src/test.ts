import AWS from 'aws-sdk';
import { uuid } from 'uuidv4';


//Script to support describing an issue for the Dynamoose team

interface ICreateUserProfileDTO {
  fullname: string;
  username: string;
  email: string;
}

interface ICreatePlaceDTO {
  username: string;
  placeId?: string;
  placeStatus?: string;
}


AWS.config.update({
  accessKeyId: 'xxxx',
  secretAccessKey: 'xxxx',
  region: "eu-west-1",
  endpoint: "http://localhost:8000",
});

const dynamodb = new AWS.DynamoDB();

const fakeId = uuid();

async function createTable(): Promise<any> {
  var params = {
    TableName : "MyTable",
    KeySchema: [       
        { AttributeName: "pk", KeyType: "HASH"},  //Partition key
        { AttributeName: "sk", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "pk", AttributeType: "S" },
        { AttributeName: "sk", AttributeType: "S" },
        // { AttributeName: "username", AttributeType: "S" },
        // { AttributeName: "placeId", AttributeType: "S" },
        // { AttributeName: "status", AttributeType: "S" },
        // { AttributeName: "placeStatusDate", AttributeType: "S" },
        // { AttributeName: "statusAvailableId", AttributeType: "S" },
        // { AttributeName: "createdAt", AttributeType: "S" },
        // { AttributeName: "updatedAt", AttributeType: "S" },
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    },
    /*LocalSecondaryIndexes :[{
      IndexName : "placeStatusDateIndex",
      KeySchema : [
        {
          AttributeName : "pk",
          KeyType : "HASH"
        },
        {
          AttributeName : "placeStatusDate",
          KeyType : "RANGE"
        }
      ],                           
      Projection : {
        NonKeyAttributes : ["sk","placeId","status"],
        ProjectionType : "INCLUDE"
      }
    }],
    GlobalSecondaryIndexes : [{
      IndexName : "statusAvailableIndex",
      KeySchema : [
        {
          AttributeName : "statusAvailableId",
          KeyType : "HASH"
        },
        // {
        //   AttributeName : "Artist",
        //   KeyType : "RANGE"
        // }
      ],                         
      Projection : {
        NonKeyAttributes : ["pk", "sk","placeId","status"],
        ProjectionType : "INCLUDE"
      },
      ProvisionedThroughput : {
        ReadCapacityUnits : 5,
        WriteCapacityUnits : 5
      }
    }],*/
  };

  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! CREATE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  
  try {
    const result = await dynamodb.createTable(params).promise();
      
    console.log("Created table. Table description JSON:", JSON.stringify(result, null, 2));
    return result;
  } catch (err) {
    console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));

  }

}



//Function to create a Profile in the single table MyTable
async function createProfile({
  fullname,
  username,
  email,
}: ICreateUserProfileDTO): Promise<any> {
  var params = {
    TableName: 'MyTable',
    Item: {
      'pk': {S: `USER#${username}`},
      'sk': {S: `PROFILE#${username}`},
      'username': {S: username},
      'fullname': {S: fullname},
      'email': {S: email},  
    },
    ReturnValues: 'ALL_OLD',
  };
  
  // Call DynamoDB to add the item to the table
  try {
    const result = await dynamodb.putItem(params).promise();
    console.log("Success", `\nProfile created for ${username}!\n ${JSON.stringify(result, null, 2)}\n`);
    return result;
  } catch (err) {
    console.log("Error creating profile", `\n ${JSON.stringify(err, null, 2)}\n`);
  };
}


//Function to create a Place in the single table MyTable
async function createPlace({
  username,
  placeStatus,
}: ICreatePlaceDTO): Promise<any> {
  const placeId = uuid();

  var params = {
    TableName: 'MyTable',
    Item: {
      'pk': {S: `USER#${username}`},
      'sk': {S: `PLACE#${placeId}`},
      'username': {S: username},
      'placeId': {S: placeId},
      'placeStatus': {S: placeStatus},  
    },
    ReturnValues: 'ALL_OLD',
  };
  
  // Call DynamoDB to add the item to the table
  try {
    const result = await dynamodb.putItem(params).promise();
    console.log("Success", `\nPlace created for ${username}!\n ${JSON.stringify(result, null, 2)}\n`);
    return result;
  } catch (err) {
    console.log("Error creating Place", `\n ${JSON.stringify(err, null, 2)}\n`);
  };
    
}

//Here I execute a query to retrieve the places from DynamoDB and it says the "index can't be found for query"
async function showProfiles() {

  console.log('!!! SHOW PROFILES !!!');

  var params = {
    ExpressionAttributeValues: {
      ':pk': {S: `USER#myuser-${fakeId}`},
      ':sk' : {S: 'PROFILE#'},
    },
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)', //EQ | LE | LT | GE | GT | BEGINS_WITH() | BETWEEN()
    ProjectionExpression: 'pk, sk, username, fullname, email',
    TableName: 'MyTable'
  };
  
  try {
    const result = await dynamodb.query(params).promise();
    
    console.log("Success Profile!", result.Items);
    result.Items.forEach(function(element, index, array) {
      console.log(element.fullname.S + " (" + element.email.S + ")");
    });
    return result;

  } catch (err) {
    console.log("Error", err);
  }
}

//Here I execute a query to retrieve the places from DynamoDB and it says the "index can't be found for query"
async function showPlaces(): Promise<any> {

  console.log('!!! SHOW PLACES !!!');

  var params = {
    ExpressionAttributeValues: {
      ':pk': {S: `USER#myuser-${fakeId}`},
      ':sk' : {S: 'PLACE#'},
    },
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)', //EQ | LE | LT | GE | GT | BEGINS_WITH() | BETWEEN()
    ProjectionExpression: 'pk, sk, username, placeId, placeStatus',
    TableName: 'MyTable'
  };
  
  try {
    const result = await dynamodb.query(params).promise();
    
    console.log("Success", result.Items);
    result.Items.forEach(function(element, index, array) {
      console.log(element.username.S + " (" + element.placeStatus.S + ")");
    });
    return result;

  } catch (err) {
    console.log("Error", err);
  }
}

async function executeTest() {
  await createTable();
  
  //creates a profile in the single table
  await createProfile({
    username: `myuser-${fakeId}`,
    fullname: 'My User',
    email: 'my@user.com',
  });

  //creates a place in the single table
  await createPlace({ username: `myuser-${fakeId}`, placeStatus: 'AVAILABLE' });
  await createPlace({ username: `myuser-${fakeId}`, placeStatus: 'AVAILABLE' });
  await createPlace({ username: `myuser-${fakeId}`, placeStatus: 'UNAVAILABLE' });

  //should show the profiles related to a specific user
  await showProfiles();
  
  //should show the places related to a specific user
  await showPlaces();
}

executeTest();
