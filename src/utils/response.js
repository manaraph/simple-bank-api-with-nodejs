const httpStatus = require('http-status');

const APIResponse = (res, data, code = 200) => {
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(code);

  const response = {
    code,
    ...data,
  };

  return res.end(JSON.stringify(response));
};

const APIFatalResponse = (res, error) => {
  const data = {
    message: 'An error occurred',
    error,
  };
  return APIResponse(res, data, httpStatus.INTERNAL_SERVER_ERROR);
};

module.exports = { APIResponse, APIFatalResponse };
