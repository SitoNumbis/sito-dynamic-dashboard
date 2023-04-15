/* eslint-disable import/prefer-default-export */

// @ts-check

import Axios from "axios";

// @ts-ignore
import { getAuth } from "../../auth/auth.js";

// cookies
// @ts-ignore
// @ts-ignore
import { getCookie } from "some-javascript-utils/browser";

import config from "../../config";

/**
 *
 * @param {number} page
 * @param {number} count
 * @param {string} orderBy
 * @param {boolean} cleanCache
 * @returns
 */
export const productList = async (
  page = 1,
  count = 10,
  orderBy = "date",
  cleanCache = false
) => {
  if (!cleanCache)
    return JSON.parse(
      // @ts-ignore
      localStorage.getItem(
        `axios-cache:${localStorage.getItem("product-cache")}`
      )
    ).data;
  else {
    localStorage.removeItem(
      `axios-cache:${localStorage.getItem("product-cache")}`
    );
    let parameters = "";
    if (page || count || orderBy.length) {
      parameters += "?";
      if (page) parameters += `page=${page}&`;
      if (count) parameters += `count=${count}&`;
      if (orderBy.length) parameters += `orderBy=${orderBy}`;
    }
    // @ts-ignore
    const response = await Axios({
      url: `${config.apiUrl}marketplace/product/list${parameters}`,
      method: "get",
      headers: {
        ...getAuth,
        Authorization: `Bearer ${getCookie(config.basicKeyCookie)}`,
      },
    });
    // @ts-ignore
    localStorage.setItem("product-cache", response.id);
    return await response.data;
  }
};