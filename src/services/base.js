import _ from 'lodash';
import { SERVER_ADDRESS } from 'config/defaults'


export function isLoadingResponse(response) {
  return response.status === 'loading';
}

export function isSuccessResponse(response) {
  return response.status === 'success';
}

export function isFailResponse(response) {
  return response.status === 'fail';
}


function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  return response.json().then((data) => {
    const error = new Error(response.statusText);
    error.response = response;
    error.data = data;
    throw error;
  });
}

export const defaultHeaders = {
    'Content-Type': 'application/json',
};

export function getHeaders(token) {
    const headers = {
        Authorization: `Token ${token}`,
    };
    return _.merge({}, defaultHeaders, headers);
}


export async function makeGet(path, cursor, opts = {}) {
  const headers = opts.headers || defaultHeaders;
  cursor.set('status', 'loading');
  let result = {};

  try {
    let response = await fetch(`http://${SERVER_ADDRESS}${path}`, { headers }).then(checkStatus);
    let data = await response.json();
    result = {
      data,
      status: 'success',
    };
  } catch (error) {
    result = {
      error,
      status: 'fail',
    };
  }

  cursor.set(result);
  return result;
}

export async function makePost(path, cursor, data, opts = {}) {
  const method = opts.method || 'POST';
  const headers = opts.headers || defaultHeaders;

  cursor.set('status', 'loading');
  let result = {};

  const payload = {
    body: JSON.stringify(data),
    method,
    headers,
  };

  try {
    let response = await fetch(`http://${SERVER_ADDRESS}${path}`, payload).then(checkStatus);
    let respData = await response.json();

    result = {
      data: respData,
      status: 'success',
    };
  } catch (error) {
    result = {
      error,
      status: 'fail',
    };
  }

  cursor.set(result);
  return result;
}
