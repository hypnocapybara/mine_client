const tokenStorageName = 'tic-token';


export function getToken() {
  return localStorage.getItem(tokenStorageName);
}

export function storeToken(token) {
  localStorage.setItem(tokenStorageName, token);
}

export function clearToken() {
  localStorage.removeItem(tokenStorageName);
}
