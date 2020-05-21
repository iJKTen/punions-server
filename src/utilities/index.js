const success = (data = '') => {
  return {
    statusCode: 200,
    headers: {
        "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(data)
  };
}

const error = (err) => {
  return {
    statusCode: 500,
    headers: {
        "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(err)
  };
}

module.exports = {
  success, 
  error
};
