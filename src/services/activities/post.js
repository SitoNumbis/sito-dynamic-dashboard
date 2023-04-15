/* eslint-disable import/prefer-default-export */

// @ts-check

import axios from "axios";

// some-javascript-utils
import { getCookie, getUserLanguage } from "some-javascript-utils/browser";

// @ts-ignore
import { getAuth } from "../../auth/auth";

import config from "../../config";

/**
 *
 * @param {number} page
 * @param {number} count
 * @param {string} orderBy
 * @param {string[]} attributes
 * @param {any} query
 * @param {boolean} cleanCache
 * @returns
 */
export const activityList = async (
  page = 1,
  count = 10,
  orderBy = "date",
  attributes = [],
  query = [],
  cleanCache = false
) => {
  if (
    !cleanCache &&
    JSON.parse(
      // @ts-ignore
      localStorage.getItem(
        `axios-cache:${localStorage.getItem("activity-cache")}`
      )
    ) !== null
  ) {
    return JSON.parse(
      // @ts-ignore
      localStorage.getItem(
        `axios-cache:${localStorage.getItem("activity-cache")}`
      )
    ).data;
  }
  // @ts-ignore
  else {
    localStorage.removeItem(
      `axios-cache:${localStorage.getItem("activity-cache")}`
    );
    const response = await axios.post(
      `${config.apiUrl}activity/list`,
      {
        page,
        count,
        orderBy,
        attributes,
        query,
        lang: getUserLanguage(),
      },
      {
        // @ts-ignore
        headers: {
          ...getAuth,
          Authorization: `Bearer ${getCookie(config.basicKeyCookie)}`,
        },
      }
    );
    // @ts-ignore
    localStorage.setItem("activity-cache", response.id);
    return response.data;
  }
};