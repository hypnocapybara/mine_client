import { makeGet, makePost, getHeaders, isSuccessResponse } from './base';
import { storeToken } from './token';


export async function loginService(cursor, username, password) {
  const response = await makePost('/user/login/', cursor, { username, password });
  if (isSuccessResponse(response)) {
    storeToken(response.data.token);
  }
}

export async function registerService(cursor, username, password) {
  const response = await makePost('/user/', cursor, { username, password });
  if (isSuccessResponse(response)) {
    storeToken(response.data.token);
  }
}

export async function getUserByToken(cursor, token) {
  return makeGet('/user/current/', cursor, { headers: getHeaders(token) });
}
