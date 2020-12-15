const AWS = require('aws-sdk');
const region = process.env.AWS_REGION;
const SNS = new AWS.SNS({ region: region });

exports.handler = async (event) => {
  console.log('event.....=>', event);

  let text_message =
    'Thanks for calling our clinic. We will be calling you soon';
  let phone_number = event.Details.Parameters.callbacknum;

  const params = {
    Message: text_message,
    PhoneNumber: event.Details.Parameters.callbacknum,
  };

  // Create promise and SNS service object
  try {
    await SNS.publish(params).promise();
    console.log(' sns sent');
    return { lambdaResult: 'Success' };
  } catch (error) {
    return { lambdaResult: 'Failed' };
  }
};
