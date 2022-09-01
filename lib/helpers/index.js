"use strict";

const axios = require("axios");
const CryptoJS = require("crypto-js");
const moment = require("moment");

const formattedDate = () => {
  const format = "YYYY-MM-DDTHH:mm:ss";
  return moment().utc().format(format);
};

const _hmac = (key, value) => {
  return CryptoJS.HmacSHA256(
    value.toString(CryptoJS.enc.Utf8),
    key.toString(CryptoJS.enc.Utf8)
  ).toString(CryptoJS.enc.Hex);
};

const _sign = (value, formattedDate, apiKey) => {
  return _hmac(_hmac(formattedDate, apiKey), value);
};

const toQueryString = (obj) => {
  let keys = Object.keys(obj);
  keys.sort();
  const parts = [];
  for (let i in keys) {
    const key = keys[i];
    if (obj.hasOwnProperty(key) && !!obj[key] && !!obj[key].toString().length) {
      parts.push(
        encodeURIComponent(key) +
          "=" +
          encodeURIComponent(obj[key]).replace(/%20/g, "+")
      );
    }
  }
  return parts.join("&");
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
};

const callApi = (
  endpoint,
  method = "get",
  body = {},
  data,
  contentType = "application/json",
) => {
  const mobile = data.phone || "";
  const accessToken = data.accessToken || "";
  const baseUrl = data.baseUrl;
  const date = formattedDate();
  let valueToHash;
  if (method.toLowerCase() === "get") {
    const query = toQueryString(body).length ? "?" + toQueryString(body) : "";
    valueToHash = endpoint + query;
  } else if (Object.prototype.toString.call(body) === "[object FormData]") {
    valueToHash = body.get("hash");
    body.delete("hash");
  } else {
    valueToHash = JSON.stringify(body);
  }

  const headers = {
    Accept: "application/json",
    "Content-Type": contentType,
    mobile: mobile,
    "RC-Timestamp": date,
    "RC-HashV2": _sign(valueToHash, date, accessToken),
    resource_id: data.resourceId,
    app_version: data.appVersion,
  };
  if (endpoint === "/app_number" || endpoint === "/app_number_verify") {
    delete headers["RC-HashV2"];
  }
  return axios({
    method: method,
    baseURL: baseUrl,
    url: endpoint,
    data: body,
    params: method.toLowerCase() === "get" ? body : null,
    paramsSerializer: (params) => toQueryString(params),
    transformRequest: (data) => {
      /* if form data, send as is */
      if (Object.prototype.toString.call(data) === "[object FormData]") {
        return data;
      }
      /** send array as is */
      if (Object.prototype.toString.call(data) === "[object Array]") {
        return JSON.stringify(data);
      }
      /** cut indexed keys from object */
      const res = {};
      Object.keys(data).forEach((key) => {
        if (!Number(key)) {
          res[key] = data[key];
        }
      });
      return JSON.stringify(res);
    },
    headers,
  })
    .then((response) => checkStatus(response))
    .then((response) => response.data);
};

module.exports = callApi;
