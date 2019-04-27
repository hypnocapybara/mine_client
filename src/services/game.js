import { makeGet, makePost, getHeaders } from './base';


export async function gamesListService(cursor, token) {
  return makeGet('/game/', cursor, { headers: getHeaders(token) });
}

export async function createGameService(cursor, token) {
  return makePost('/game/', cursor, {}, { headers: getHeaders(token) });
}

export async function getGameService(cursor, gamePk, token) {
  return makeGet(`/game/${gamePk}/`, cursor, { headers: getHeaders(token) });
}

export async function startGameService(cursor, gamePk, token) {
  return makePost(`/game/${gamePk}/start/`, cursor, {}, {
    method: 'PUT',
    headers: getHeaders(token)
  });
}

export async function joinGameService(cursor, gamePk, token) {
  return makePost(`/game/${gamePk}/join/`, cursor, {}, {
    method: 'PUT',
    headers: getHeaders(token)
  });
}

export async function testFieldService(cursor, gamePk, x, y, token) {
  return makePost(`/game/${gamePk}/test/`, cursor, { x, y }, {
    method: 'PUT',
    headers: getHeaders(token)
  });
}

export async function flagFieldService(cursor, gamePk, x, y, token) {
  return makePost(`/game/${gamePk}/flag/`, cursor, { x, y }, {
    method: 'PUT',
    headers: getHeaders(token)
  });
}
