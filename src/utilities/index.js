const success = (data = '') => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(data)
  };
};

const error = (err) => {
  return {
    statusCode: 500,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: err
  };
};

const safeConnectionId = (connectionId) => {
  return connectionId.replace('=', '');
};

const unsafeConnectionId = (connectionId) => {
  return connectionId.concat('=');
};

module.exports = {
  success,
  error,
  safeConnectionId,
  unsafeConnectionId
};
