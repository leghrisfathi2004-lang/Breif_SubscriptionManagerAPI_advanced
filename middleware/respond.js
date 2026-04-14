const respond = (res, code, data) => {
  return res.status(code).json({status: getStatus(code), data:data });   
}

function getStatus(code) {
  const statuses = {
    200: "OK",
    201: "Created",
    204: "No Content",
    301: "Moved Permanently",
    302: "Found",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
    422: "Unprocessable Entity",
    429: "Too Many Requests",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable"
  };

  return statuses[code] ?? "Unknown status";
}

module.exports = { respond };