'use strict';

const AWS = require('aws-sdk');
const region = process.env.REGION;
const fromEmail = process.env.FROM_EMAIL;
const docClient = new AWS.DynamoDB.DocumentClient({ region: region });
const SES = new AWS.SES();
const table = 'provider_email';

exports.handler = async (event) => {
  console.log('passed parameters: ', event);

  let mrn = event.Details.Parameters.mrn;
  let params = {
    TableName: table,
    Key: {
      mrn: mrn,
    },
  };

  let data = await docClient.get(params).promise();
  if (!data) {
    console.log('this is error');
    let status_code = 200;
    return status_code;
  } else {
    const jsonData = JSON.stringify(data);
    //console.log('data is to string: ',jsonData);
    const objData = JSON.parse(jsonData);
    //console.log('objData : ', objData);
    //console.log('email = ', objData.Item.email);

    let parameters = {
      Destination: {
        ToAddresses: [objData.Item.email],
      },
      Message: {
        Body: {
          Text: {
            Data:
              'Patient with the above MRN is recently tested with Covid 19. Please reach out to the Patient to make neccessay arrangement',
          },
        },
        Subject: {
          Data: 'Patient medical record number:  ' + mrn + '!!',
        },
      },
      Source: fromEmail,
    };

    try {
      await SES.sendEmail(parameters).promise();
      console.log('Email sent');
      return { lambdaResult: 'Success' };
    } catch (error) {
      console.log('error sending email', error);
      return { lambdaResult: 'Failed' };
    }
  }
};
