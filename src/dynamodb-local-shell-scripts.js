/* 
Copy and paste the content of this file on http://localhost:8000/shell 
if you are running the local dynamodb instance
*/

//LIST ALL TABLES
var params = {
};
dynamodb.listTables(params, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});


//DESCRIBE MyTable
var params = {
    TableName: 'MyTable',
};
dynamodb.describeTable(params, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});


//SCAN MyTable
var params = {
    TableName: 'MyTable',
    Select: 'ALL_ATTRIBUTES', // optional (ALL_ATTRIBUTES | ALL_PROJECTED_ATTRIBUTES | SPECIFIC_ATTRIBUTES | COUNT)
    
};
dynamodb.scan(params, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});