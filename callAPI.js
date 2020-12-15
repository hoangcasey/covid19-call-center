'use strict';
const request = require('request');

const requestHandler = (options) =>
  new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        console.log(response, body);
        resolve({ response, body });
      }
    });
  });

exports.handler = async (event) => {
  console.log('what is the event ', event);
  let st = event.state;
  console.log('st at this point ', st);
  let options = {
    url: 'https://covidtracking.com/api/states?state=' + st,
    method: 'GET',
  };
  console.log('at this optios : ', options);
  const { response, body } = await requestHandler(options);

  return {
    statusCode: 200,
    body: {
      message: JSON.parse(body),
      input: event,
    },
  };
};
