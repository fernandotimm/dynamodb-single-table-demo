
const MyTableSchema = {
  TableName : "MyTable",
  KeySchema: [       
      { AttributeName: "pk", KeyType: "HASH"},  //Partition key
      { AttributeName: "sk", KeyType: "RANGE" }  //Sort key
  ],
  AttributeDefinitions: [       
      { AttributeName: "pk", AttributeType: "S" },
      { AttributeName: "sk", AttributeType: "S" },
      { AttributeName: "placeStatusDate", AttributeType: "S" },
      { AttributeName: "placeStatus", AttributeType: "S" },
      { AttributeName: "entryType", AttributeType: "S" },
  ],
  ProvisionedThroughput: {       
      ReadCapacityUnits: 10, 
      WriteCapacityUnits: 10
  },
  LocalSecondaryIndexes :[{
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
      NonKeyAttributes : ["sk","placeId"],
      ProjectionType : "INCLUDE"
    }
  }],

  GlobalSecondaryIndexes : [{
    IndexName : "statusAvailableIndex",
    KeySchema : [
      {
        AttributeName : "placeStatus",
        KeyType : "HASH"
      },
      {
        AttributeName : "sk",
        KeyType : "RANGE"
      }
    ],                         
    Projection : {
      NonKeyAttributes : ["pk", "sk", "placeId", "username", "placeStatusDate"],
      ProjectionType : "INCLUDE"
    },
    ProvisionedThroughput : {
      ReadCapacityUnits : 5,
      WriteCapacityUnits : 5
    }
  },
  {
    IndexName : "placeIndex",
    KeySchema : [
      {
        AttributeName : "entryType",
        KeyType : "HASH"
      },
      {
        AttributeName : "sk",
        KeyType : "RANGE"
      }
    ],                         
    Projection : {
      NonKeyAttributes : ["pk", "sk", "placeId", "username", "placeStatusDate", "placeStatus"],
      ProjectionType : "INCLUDE"
    },
    ProvisionedThroughput : {
      ReadCapacityUnits : 5,
      WriteCapacityUnits : 5
    }
  }],
}

export default MyTableSchema;