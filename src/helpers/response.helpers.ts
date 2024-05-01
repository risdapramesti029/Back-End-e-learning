export class ResponseHelper {
  responseSuccess = (res, code, message) => {
    return res.status(code).send({
      code,
      status: 'success',
      message,
    });
  };
  responseSuccessData = (res, code, message, data) => {
    return res.status(code).send({
      code,
      status: 'success',
      message,
      data,
    });
  };

  responseSuccessDataFile = (res, code, message, hostname, data) => {
    return res.status(code).send({
      code,
      status: 'success',
      message,
      hostname,
      data,
    });
  };

  responseClientError = (res, code, message) => {
    return res.status(code).send({
      code,
      status: 'error',
      message,
    });
  };
  responseServerError = (res) => {
    return res.status(500).send({
      code: 500,
      status: 'error',
      message: 'Internal Server Error',
    });
  };
}
