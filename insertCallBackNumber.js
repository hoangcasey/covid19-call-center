'use strict';

const AWS = require('aws-sdk');
const region = process.env.REGION;
const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient({ region: region });

exports.handler = async (event) => {
  console.log('passed parameters: ', event);

  let callbacknum = event.Details.Parameters.callbacknum;
  var timestamp = new Date().getTime().toString;
  var table = 'callback_number_list';
  var datetime = new Date().toString();
  console.log('my phonum is: ', callbacknum);

  let params = {
    TableName: table,
    Key: {
      callbacknum: callbacknum,
    },
    FilterExpression: 'callbacknum = :callbacknum',
    ExpressionAttributeValues: {
      ':callbacknum': callbacknum,
    },
  };
  console.log('scan params: ', params);

  let data = await docClient.scan(params).promise();
  if (data.Count < 1) {
    let insertParams = {
      TableName: table,
      Item: {
        callbacknum: callbacknum,
        date: datetime,
        timestamp: timestamp,
      },
    };
    try {
      await docClient.put(insertParams).promise();
      console.log('data inserted');
      return { lambdaResult: 'Success' };
    } catch (error) {
      console.log('error inserting', error);
      return { lambdaResult: 'Failed' };
    }
  } else {
    return { lambdaResult: 'Success' };
    console.log('same phone number found data.count  : ', data.Count);
  }
};
