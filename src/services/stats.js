import { makeGet, getHeaders } from './base';


export async function statsService(cursor, token) {
  return makeGet('/stats/', cursor, { headers: getHeaders(token) });
}
