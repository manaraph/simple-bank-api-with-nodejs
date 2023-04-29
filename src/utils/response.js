const APIResponse = (res, data, code = 200) => {
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(code);

  const response = {
    code,
    ...data,
  };

  return res.end(JSON.stringify(response));
};

export default APIResponse;
