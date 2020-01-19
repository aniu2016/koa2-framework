
type restful = {
  code: Number,
  message: String,
  data: any
};

export const SUCCESS = 200;
export const UNLOGIN = 401;
export const NOPERMISSION = 402;
export const OTHER_ERR = 500;
export const formatResponse = function formatResponse (code: Number, data: any, message?: String): restful {

  if (typeof data === 'string') {
    message = data;
    data = {};
  }

  return {
    code,
    message: message || (code === SUCCESS ? 'success'  : 'error'),
    data
  };
};

export default formatResponse;