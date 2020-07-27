import AWS from 'aws-sdk';
import { uuid } from 'uuidv4';
import MyTableSchema from './mytable-schema';

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
  var params:AWS.DynamoDB.CreateTableInput = MyTableSchema;
  
  try {
    const result = await dynamodb.createTable(params).promise();
    console.log('Created table. Table description JSON:', JSON.stringify(result, null, 2));
    
    return result;

  } catch (err) {
    console.error('Unable to create table', err.message);
  }
}


//Function to create a Profile in the single table MyTable
async function createProfile({
  fullname,
  username,
  email,
}: ICreateUserProfileDTO): Promise<any> {
  const now:string = new Date(Date.now()).toISOString();

  var params = {
    TableName: 'MyTable',
    Item: {
      'pk': {S: `USER#${username}`},
      'sk': {S: `PROFILE#${username}`},
      'username': {S: username},
      'fullname': {S: fullname},
      'email': {S: email},
      'createdAt': {S: now},
      'updatedAt': {S: now},
      'entryType': {S: 'PROFILE'},
    },
    ReturnValues: 'ALL_OLD',
  };
  
  // Call DynamoDB to add the item to the table
  try {
    const result = await dynamodb.putItem(params).promise();
    console.log('Success', `Profile created for ${username}!\n`);
    return result;
  } catch (err) {
    console.log('Error creating profile', `${JSON.stringify(err, null, 2)}\n`);
  };
}


//Function to create a Place in the single table MyTable
async function createPlace({
  username,
  placeStatus,
}: ICreatePlaceDTO): Promise<any> {
  const placeId:string = uuid();
  const now:string = new Date(Date.now()).toISOString();

  const params:AWS.DynamoDB.PutItemInput = {
    TableName: 'MyTable',
    Item: {
      'pk': {S: `USER#${username}`},
      'sk': {S: `PLACE#${placeId}`},
      'username': {S: username},
      'placeId': {S: placeId},
      'placeStatus': {S: placeStatus}, 
      'placeStatusDate': {S: `${placeStatus}#${now}`},
      'createdAt': {S: now},
      'updatedAt': {S: now},
      'entryType': {S: 'PLACE'},
    },
    ReturnValues: 'ALL_OLD',
  };
  
  // Call DynamoDB to add the item to the table
  try {
    const result = await dynamodb.putItem(params).promise();
    console.log('Success', `Place created for ${username}!\n`);
    return result;

  } catch (err) {
    console.log('Error creating Place', `${JSON.stringify(err, null, 2)}\n`);
  };
    
}


//Execute a query to retrieve the places from DynamoDB
async function showProfiles() {

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
    
    if (result.Items) {
      console.log('SHOW PROFILES');
      result.Items.forEach(function(element, index, array) {
        console.log(`${element.fullname.S} ( ${element.email.S} )`);
      });
    }
    return result;

  } catch (err) {
    console.log("Error", err);
  }
}


//Execute a query to retrieve the places from DynamoDB
async function showPlaces(): Promise<any> {
  var params = {
    ExpressionAttributeValues: {
      ':pk': {S: `USER#myuser-${fakeId}`},
      ':sk' : {S: 'PLACE#'},
    },
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)', 
    ProjectionExpression: 'pk, sk, username, placeId, placeStatus',
    TableName: 'MyTable'
  };
  
  try {
    const result = await dynamodb.query(params).promise();
    
    
    if (result.Items) {
      console.log("\nSHOW PLACES BY USER");
      result.Items.forEach(function(element, index, array) {
        console.log(`${element.username.S} ( ${element.placeStatus.S} )`);
      });
    }
    return result;

  } catch (err) {
    console.log("Error", err);
  }
}


//Runs a query to retrieve the places owned by a specific user
async function showPlacesStatusByUser(): Promise<any> {
  const params:AWS.DynamoDB.QueryInput = {
    ExpressionAttributeValues: {
      ':pk': {S: `USER#myuser-${fakeId}`},
      ':sk' : {S: 'AVAILABLE#'},
    },
    KeyConditionExpression: 'pk = :pk and begins_with(placeStatusDate, :sk)',
    ProjectionExpression: 'pk, sk, username, placeId, placeStatus, placeStatusDate',
    TableName: 'MyTable',
    IndexName: 'placeStatusDateIndex',
  };
  
  try {
    const result = await dynamodb.query(params).promise();
    
    
    if (result.Items) {
      console.log("\nSHOW PLACES STATUS BY USER");
      result.Items.forEach(function(element, index, array) {
        console.log(`${element.username.S} ( ${element.placeId.S} ${element.placeStatus.S} )`);
      });
    }
    return result;

  } catch (err) {
    console.log("Error", err);
  }
}


//Runs a query to retrieve all AVAILABLE places
async function showAllPlacesByStatusAvailable(): Promise<any> {
  const params:AWS.DynamoDB.QueryInput = {
    ExpressionAttributeValues: {
      ':pk': {S: 'AVAILABLE'},
      ':sk' : {S: 'PLACE#'},
    },
    KeyConditionExpression: 'placeStatus = :pk and begins_with(sk, :sk)', 
    ProjectionExpression: 'pk, sk, username, placeId, placeStatus, placeStatusDate',
    TableName: 'MyTable',
    IndexName: 'statusAvailableIndex',
  };
  
  try {
    const result = await dynamodb.query(params).promise();
    
    if (result.Items) {
      console.log("\nSHOW PLACES STATUS BY USER");
      result.Items.forEach(function(element, index, array) {
        console.log(`${element.sk.S} ( ${element.username.S} ${element.placeStatus.S} )`);
      });
    }
    return result;

  } catch (err) {
    console.log("Error", err);
  }
}

//Runs a query to retrieve all places
async function showAllPlaces(): Promise<any> {
  const params:AWS.DynamoDB.QueryInput = {
    ExpressionAttributeValues: {
      ':pk': {S: 'PLACE'},
      ':sk' : {S: 'PLACE#'},
    },
    KeyConditionExpression: 'entryType = :pk and begins_with(sk, :sk)', //EQ | LE | LT | GE | GT | BEGINS_WITH() | BETWEEN()
    ProjectionExpression: 'pk, sk, username, placeId, placeStatus, placeStatusDate',
    TableName: 'MyTable',
    IndexName: 'placeIndex',
  };
  
  try {
    const result = await dynamodb.query(params).promise();
    
    
    if (result.Items) {
      console.log("\nSHOW ALL PLACES");
      result.Items.forEach(function(element, index, array) {
        console.log(`${element.sk.S} ( ${element.placeStatus.S} )`);
      });
    }
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

  //creates some places in the single table
  await createPlace({ username: `myuser-${fakeId}`, placeStatus: 'AVAILABLE' });
  await createPlace({ username: `myuser-${fakeId}`, placeStatus: 'AVAILABLE' });
  await createPlace({ username: `myuser-${fakeId}`, placeStatus: 'UNAVAILABLE' });

  //should show the profiles related to a specific user
  await showProfiles();
  
  //should show the places related to a specific user
  await showPlaces();

  //should show the status of the places related to a specific user
  await showPlacesStatusByUser();
  
  //should show all places with status available
  await showAllPlacesByStatusAvailable();

  //should show all places
  await showAllPlaces();
}

executeTest();
