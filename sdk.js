"use strict";

const axios = require("axios");
const CryptoJS = require('crypto-js');
const moment = require('moment');


class RedcarpetUpAPI{
    constructor({resourceId, productType, appVersion}){
        this.BASE_URL = "https://api.redcarpetup.com";
        this.resourceId = resourceId || '';
        this.productType = productType || '';
        this.appVersion = appVersion || '';
    }

    isOk(){
        console.log('i am working');
    }
}

// const RedcarpetUpAPI = function ({ resourceId, productType, appVersion }) {

//     const BASE_URL = "https://api.redcarpetup.com";

//     this.resourceId = resourceId || '';
//     this.productType = productType || '';
//     this.appVersion = appVersion || '';

//     this.isOk=function() {
//         console.log('i am working');
//     };

//     this.getOtp = function ({ phone }) {
//         return callApi(
//             "/user_mobile_signup",
//             "GET",
//             {
//                 mobile: phone,
//                 resource_id: this.resourceId,
//             },
//             phone
//         );
//     }

//     this.verifyOtp = async function ({ otp, phone }) {
//         const response = await callApi(
//             "/user_mobile_verify",
//             "GET",
//             {
//                 mobile: phone,
//                 code: otp,
//                 resource_id: this.resourceId,
//             },
//             phone
//         );
//         if (response.result === "success") {
//             await callApi(
//                 "/set_branch_data",
//                 "POST",
//                 { skipReferral: true, utm_medium: this.productType },
//                 phone,
//                 response.access_token
//             );
//             return response;
//         } else {
//             throw new Error(response.message);
//         }
//     }

//     this.setUserPersonalInfo = function ({ pincode, work, addressType, email, phone, accessToken }) {
//         return callApi(
//             "/set_personal_info",
//             "POST",
//             {
//                 pincode: pincode,
//                 occupation: work,
//                 address_type: addressType,
//                 email: email,
//             },
//             phone,
//             accessToken
//         );
//     }

//     this.getUserStatus = function ({ phone, accessToken }) {
//         return callApi(
//             `/user_products_and_states/${this.productType}`,
//             "GET",
//             {},
//             phone,
//             accessToken
//         );
//     }

//     this.getUserCardDetails = function ({ phone, accessToken }) {
//         return callApi(
//             "/get_user_card_details",
//             "GET",
//             {},
//             phone,
//             accessToken
//         );
//     }

//     this.getUserProfile = function ({ phone, accessToken }) {
//         return callApi(
//             "/get_new_user_profile",
//             "GET",
//             {},
//             phone,
//             accessToken
//         );
//     }

//     this.selectProduct = function ({ phone, accessToken }) {
//         return callApi(
//             `/select_${this.productType}_as_a_product`,
//             "GET",
//             {},
//             phone,
//             accessToken
//         );
//     };

//     this.verifyAadhaarCardOtp = function ({ phone, accessToken, otp, aadhaarNumber, clientId }) {
//         return callApi(
//             `/verify_aadhar_id_${this.productType}`,
//             "POST",
//             {
//                 otp: otp,
//                 type: "verify",
//                 client_id: clientId,
//                 aadhar_no: aadhaarNumber,
//             },
//             phone,
//             accessToken
//         );
//     }

//     this.generateAadhaarOtpToVerify = function ({ phone, accessToken, aadhaarNumber, pincode, work, email, addressType }) {
//         return callApi(
//             `/verify_aadhar_id_${this.productType}`,
//             "POST",
//             {
//                 pincode: pincode,
//                 occupation: work,
//                 address_type: addressType,
//                 aadhar_no: aadhaarNumber,
//                 type: "generate",
//                 email: email,
//             },
//             phone,
//             accessToken
//         );
//     }

//     this.setUserPanCard = function ({ phone, pan, accessToken }) {
//         return callApi(
//             `/set_pan_${this.productType}`,
//             "POST",
//             {
//                 pan
//             },
//             phone,
//             accessToken
//         );
//     }

//     this.acceptUserAgreementEsign = function ({ phone, accessToken }) {
//         return callApi(
//             `/accept_user_agreement_esign_${this.productType}`,
//             "GET",
//             {},
//             phone,
//             accessToken
//         );
//     }

//     this.generateUserEsign = function ({ phone, accessToken }) {
//         return callApi(
//             `/generate_user_esign_${this.productType}`,
//             "GET",
//             {},
//             phone,
//             accessToken
//         );
//     }

//     this.getUserDocuments = function ({ userProductId, phone, accessToken }) {
//         return callApi(
//             "/get_user_documents",
//             "GET",
//             {
//                 user_product_id: userProductId,
//             },
//             phone,
//             accessToken
//         );
//     }

//     this.userDocsToUpload = function ({ phone, accessToken }) {
//         return callApi(
//             "/docs_for_upload",
//             "GET",
//             {
//                 docs_for: this.productType
//             },
//             phone,
//             accessToken
//         );
//     }

//     this.uploadUserDocument = function ({ documentType, deviceId, imeiNo, document_sequence, url, userProductId, phone, accessToken }) {
//         return callApi(
//             `/set_user_profile_ids_${this.productType}`,
//             "POST",
//             {
//                 type: documentType,
//                 deviceId: deviceId || "",
//                 imeiNo: imeiNo || "",
//                 document_sequence: document_sequence,
//                 product_type: this.productType,
//                 confirm_upload: false,
//                 url: url,
//                 user_product_id: userProductId,
//             },
//             phone,
//             accessToken
//         );
//     }

//     this.confirmUserDocUpload = function ({ userProductId, phone, accessToken }) {
//         return callApi(
//             `/set_user_profile_ids_${this.productType}`,
//             "POST",
//             {
//                 confirm_upload: true,
//                 product_type: this.productType,
//                 user_product_id: userProductId,
//             },
//             phone,
//             accessToken
//         );
//     }

//     this.activateUserCard = function ({ phone, accessToken, userProductId }) {
//         return callApi(
//             `/create_activity_for_${this.productType}`,
//             "POST",
//             {
//                 product_id: userProductId,
//             },
//             phone,
//             accessToken
//         );
//     }

//     this.getUserStatements = function ({ loanId, phone, accessToken }) {
//         return callApi(
//             "/get_statement/" + loanId,
//             "GET",
//             {
//                 source: "ledger",
//                 product_type: this.productType,
//             },
//             phone,
//             accessToken
//         );
//     }

//     this.sendBlockUnblockCardOtp = function ({ phone, accessToken }) {
//         return callApi(
//             "/send_user_otp",
//             "POST",
//             { source_type: "lk_ul_card" },
//             phone,
//             accessToken
//         );
//     }

//     this.blockUnblockUserCard = function ({ phone, accessToken, cardStatus, kitNumber, otp }) {
//         return callApi(
//             "/card_operations_app",
//             "POST",
//             {
//                 operation: cardStatus == "ACTIVE" ? "L" : "UL",
//                 card_kit_number: kitNumber,
//                 otp: otp,
//             },
//             phone,
//             accessToken
//         );
//     }

//     this.getCardSettings = function ({ phone, accessToken, kitNumber }) {
//         return callApi(
//             "/get_card_settings",
//             "GET",
//             { kit_number: kitNumber },
//             phone,
//             accessToken
//         );
//     }

//     this.setCardSettings = function ({ phone, accessToken, kitNumber, currentDailySpendLimit, singleTxnLimit, currentDailyTxn }) {
//         return callApi(
//             "/set_card_settings",
//             "POST",
//             {
//                 kit_number: kitNumber,
//                 current_daily_txn: currentDailyTxn,
//                 single_txn_limit: singleTxnLimit,
//                 current_daily_spend_limit: currentDailySpendLimit,
//             },
//             phone,
//             accessToken
//         );
//     }

//     this.sendUserResetPinOtp = function ({ phone, accessToken }) {
//         return callApi(
//             "/send_user_otp",
//             "POST",
//             { source_type: "card_cvv" },
//             phone,
//             accessToken
//         );
//     }

//     this.setPin = function ({ phone, accessToken, kitNumber, otp, pin, expiryDate }) {
//         return callApi(
//             "/set_card_pin",
//             "POST",
//             {
//                 pin: pin,
//                 dob: moment(dob).format("DDMMYYYY"),
//                 expiry_date: expiryDate,
//                 otp: otp,
//                 kit_no: kitNumber,
//             },
//             phone,
//             accessToken
//         );
//     }

//     this.createPaymentRequest = function ({ phone, accessToken, amount, value, type, userProductId }) {
//         return callApi(
//             "/ledger_create_payment_request",
//             "POST",
//             {
//                 payment_data: {
//                     amount,
//                     value,
//                     type,
//                     extra_details: {
//                         user_product_id: userProductId,
//                     }
//                 },
//             },
//             phone,
//             accessToken
//         );
//     }

//     this.capturePayment = function ({ paymentRequestId, phone, accessToken, razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
//         return callApi(
//             "/capture_razorpay_payment",
//             "POST",
//             {
//                 payment_request_id: paymentRequestId,
//                 razorpay_payment_id: razorpayPaymentId,
//                 razorpay_signature: razorpaySignature,
//                 razorpay_order_id: razorpayOrderId,
//             },
//             phone,
//             accessToken
//         );
//     }

//     const checkStatus = function (response) {
//         if (response.status >= 200 && response.status < 300) {
//             return response;
//         } else {
//             const error = new Error(response.statusText);
//             error.response = response;
//             throw error;
//         }
//     }

//     const toQueryString = function (obj) {
//         let keys = Object.keys(obj);
//         keys.sort();
//         const parts = [];
//         for (let i in keys) {
//             const key = keys[i];
//             if (obj.hasOwnProperty(key) && !!obj[key] && !!obj[key].toString().length) {
//                 parts.push(
//                     encodeURIComponent(key) +
//                     '=' +
//                     encodeURIComponent(obj[key]).replace(/%20/g, '+')
//                 );
//             }
//         }
//         return parts.join('&');
//     }

//     const formattedDate = function () {
//         const format = 'YYYY-MM-DDTHH:mm:ss';
//         return (
//             moment()
//                 .utc()
//                 .format(format)
//         );
//     }

//     const _sign = function (value, formattedDate, apiKey) {
//         return _hmac(_hmac(formattedDate, apiKey), value);
//     }

//     const _hmac = function (key, value) {
//         return CryptoJS.HmacSHA256(
//             value.toString(CryptoJS.enc.Utf8),
//             key.toString(CryptoJS.enc.Utf8)
//         ).toString(CryptoJS.enc.Hex);
//     }

//     const callApi = function (
//         endpoint,
//         method = 'get',
//         body = {},
//         mobile = this.phone,
//         accessToken = this.accessToken || '',
//         contentType = 'application/json'
//     ) {
//         const baseUrl = BASE_URL;
//         const date = formattedDate();
//         let valueToHash;
//         if (method.toLowerCase() === 'get') {
//             const query = toQueryString(body).length ? '?' + toQueryString(body) : '';
//             valueToHash = endpoint + query;
//         } else if (Object.prototype.toString.call(body) === '[object FormData]') {
//             valueToHash = body.get('hash');
//             body.delete('hash');
//         } else {
//             valueToHash = JSON.stringify(body);
//         }

//         const headers = {
//             Accept: 'application/json',
//             'Content-Type': contentType,
//             mobile: mobile,
//             'RC-Timestamp': date,
//             'RC-HashV2': _sign(valueToHash, date, accessToken),
//             resource_id: this.resourceId,
//             app_version: this.appVersion
//         };
//         if (endpoint === '/app_number' || endpoint === '/app_number_verify') {
//             delete headers['RC-HashV2'];
//         }
//         return axios({
//             method: method,
//             baseURL: baseUrl,
//             url: endpoint,
//             data: body,
//             params: method.toLowerCase() === 'get' ? body : null,
//             paramsSerializer: toQueryString,
//             transformRequest: data => {
//                 /* if form data, send as is */
//                 if (Object.prototype.toString.call(data) === '[object FormData]') {
//                     return data;
//                 }
//                 /** send array as is */
//                 if (Object.prototype.toString.call(data) === '[object Array]') {
//                     return JSON.stringify(data);
//                 }
//                 /** cut indexed keys from object */
//                 const res = {};
//                 Object.keys(data).forEach(key => {
//                     if (!isNumber(key)) {
//                         res[key] = data[key];
//                     }
//                 });
//                 return JSON.stringify(res);
//             },
//             headers,
//         })
//             .then(checkStatus)
//             .then(response => response.data);
//     };


// };

module.exports = RedcarpetUpAPI;