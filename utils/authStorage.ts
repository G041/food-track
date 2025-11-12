import * as SecureStore from 'expo-secure-store';

export async function saveToken(token: string) {
  await SecureStore.setItemAsync('accessToken', token);
}

export async function getToken(): Promise<string | null> {
  return await SecureStore.getItemAsync('accessToken');
}

export async function deleteToken() {
  await SecureStore.deleteItemAsync('accessToken');
}

export async function saveUsername(username: string) {
  await SecureStore.setItemAsync('username', username);
}

export async function getUsername() {
  return await SecureStore.getItemAsync('username');
}

export async function deleteUsername() {
  await SecureStore.deleteItemAsync('username');
}

export async function saveUserID(userID: string) {
  await SecureStore.setItemAsync('user_id', userID);
}

export async function getUserID() {
  return await SecureStore.getItemAsync('user_id');
}

export async function deleteUserID() {
  await SecureStore.deleteItemAsync('user_id');
}

export async function clearCredentials() {
  await deleteToken();
  await deleteUsername();
  await deleteUserID();
}