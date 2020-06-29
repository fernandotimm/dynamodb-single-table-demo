import * as dynamoose from 'dynamoose';
import { uuid } from 'uuidv4';

//Script to support describing issue on Dynamoose

interface ICreateUserProfileDTO {
  name: string;
  username: string;
  email: string;
}

interface ICreatePlaceDTO {
  username: string;
  placeId?: string;
  status?: string;
}

dynamoose.aws.sdk.config.update({
  region: 'eu-west-1',
  accessKeyId: 'xxxx',
  secretAccessKey: 'xxxx',
});

dynamoose.aws.ddb.local();

const fakeId = uuid();

//Schema that defines the structure of a Place entry on the single table
const UserPlaceSchema = new dynamoose.Schema(
  {
    pk: {
      type: String,
      hashKey: true,
    },
    sk: {
      type: String,
      rangeKey: true,
    },
    username: {
      type: String,
      required: true,
    },
    placeId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

//Schema that defines the structure of a Profile entry on the single table
const UserProfileSchema = new dynamoose.Schema(
  {
    pk: {
      type: String,
      hashKey: true,
    },
    sk: {
      type: String,
      rangeKey: true,
    },
    username: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

//Function to create a Profile in the single table MyTable
async function createProfile({
  name,
  username,
  email,
}: ICreateUserProfileDTO): Promise<any> {
  const profile = await dynamoose.model('MyTable', UserProfileSchema).create({
    pk: `USER#${username}`,
    sk: `PROFILE#${username}`,
    username,
    name,
    email,
  });

  console.log(
    `\nProfile created for ${username}!\n ${JSON.stringify(profile)}\n`,
  );
}

//Function to create a Place in the single table MyTable
async function createPlace({
  username,
  status,
}: ICreatePlaceDTO): Promise<any> {
  const placeId = uuid();

  const place = await dynamoose.model('MyTable', UserPlaceSchema).create({
    pk: `USER#${username}`,
    sk: `PLACE#${placeId}`,
    username,
    placeId,
    status,
  });

  console.log(`\nPlace created!for ${username}!\n ${JSON.stringify(place)}\n`);
}

//Here I execute a query to retrieve the places from DynamoDB and it says the "index can't be found for query"
async function showProfiles() {
  const resultProfiles = await dynamoose
    .model('MyTable', UserProfileSchema)
    .query('pk')
    .eq(`USER#myuser-${fakeId}`)
    .and()
    .where('sk')
    .beginsWith('PROFILE#')
    .exec();

  console.log(`\nShow Profiles:\n ${JSON.stringify(resultProfiles)}\n`);
}

//Here I execute a query to retrieve the places from DynamoDB and it says the "index can't be found for query"
async function showPlaces() {
  const resultPlaces = await dynamoose
    .model('MyTable', UserPlaceSchema)
    .query('pk')
    .eq(`USER#myuser-${fakeId}`)
    .and()
    .where('sk')
    .beginsWith('PLACE#')
    .exec();

  console.log(`\nShow Places:\n ${JSON.stringify(resultPlaces)}\n`);
}

async function executeTest() {
  //creates a profile in the single table

  

  await createProfile({
    username: `myuser-${fakeId}`,
    name: 'My User',
    email: 'my@user.com',
  });

  //creates a place in the single table
  await createPlace({ username: `myuser-${fakeId}`, status: 'AVAILABLE' });

  //should show the profiles
  await showProfiles();

  //should show the places
  await showPlaces();
}

executeTest();
