import axios from "axios";
import { getAuth } from "../lib/auth";
import config from "../lib/config";

// some-javascript-utils
import { getCookie } from "some-javascript-utils/browser";

import md5 from "md5";

/**
 *
 * @param {string} type
 * @returns
 */
export const validateBasicKey = async (type) => {
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}auth/${type === "admin" ? "is-admin" : "validate"}`,
    {},
    {
      headers: {
        ...getAuth,
        Authorization: `Bearer ${getCookie(config.basicKeyCookie)}`,
      },
    }
  );
  const data = await response.data;
  if (data.data.user) return data.data.user;
  return false;
};

/**
 * Takes a user object and sends it to the backend to be authenticated
 * @param {string} user - the user name
 * @param {string} password - the user password
 * @returns The response from the server.
 */
export const login = async (user, password, remember) => {
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}auth/login`,
    { user, password: md5(password), remember },
    {
      headers: getAuth,
    }
  );
  const data = await response.data;
  return data;
};
