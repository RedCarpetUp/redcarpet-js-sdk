"use strict";

const axios = require("axios");
const CryptoJS = require('crypto-js');
const moment = require('moment');


class Base{
    constructor(options={}){
        const {phone,accessToken,resourceId,appVersion,devMode}=options
        this.BASE_URL = devMode?"https://apicherry-v3.redcarpetup.com/":"https://api.redcarpetup.com/";
        this.phone=phone;
        this.accessToken=accessToken;
        this.resourceId=resourceId;
        this.appVersion=appVersion
    }

    formattedDate () {
        const format = 'YYYY-MM-DDTHH:mm:ss';
        return (
            moment()
                .utc()
                .format(format)
        );
    }

    _hmac (key, value) {
        return CryptoJS.HmacSHA256(
            value.toString(CryptoJS.enc.Utf8),
            key.toString(CryptoJS.enc.Utf8)
        ).toString(CryptoJS.enc.Hex);
    }

    _sign  (value, formattedDate, apiKey) {
        return this._hmac(this._hmac(formattedDate, apiKey), value);
    }


     toQueryString (obj) {
        let keys = Object.keys(obj);
        keys.sort();
        const parts = [];
        for (let i in keys) {
            const key = keys[i];
            if (obj.hasOwnProperty(key) && !!obj[key] && !!obj[key].toString().length) {
                parts.push(
                    encodeURIComponent(key) +
                    '=' +
                    encodeURIComponent(obj[key]).replace(/%20/g, '+')
                );
            }
        }
        return parts.join('&');
    }

    checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            const error = new Error(response.statusText);
            error.response = response;
            throw error;
        }
    }

     callApi  (
        endpoint,
        method = 'get',
        body = {},
        mobile = this.phone,
        accessToken = this.accessToken || '',
        contentType = 'application/json'
    ) {
        const baseUrl = this.BASE_URL;
        const date = this.formattedDate();
        let valueToHash;
        if (method.toLowerCase() === 'get') {
            const query = this.toQueryString(body).length ? '?' + this.toQueryString(body) : '';
            valueToHash = endpoint + query;
        } else if (Object.prototype.toString.call(body) === '[object FormData]') {
            valueToHash = body.get('hash');
            body.delete('hash');
        } else {
            valueToHash = JSON.stringify(body);
        }

        const headers = {
            Accept: 'application/json',
            'Content-Type': contentType,
            mobile: mobile,
            'RC-Timestamp': date,
            'RC-HashV2': this._sign(valueToHash, date, accessToken),
            resource_id: this.resourceId,
            app_version: this.appVersion
        };
        if (endpoint === '/app_number' || endpoint === '/app_number_verify') {
            delete headers['RC-HashV2'];
        }
        return axios({
            method: method,
            baseURL: baseUrl,
            url: endpoint,
            data: body,
            params: method.toLowerCase() === 'get' ? body : null,
            paramsSerializer: this.toQueryString,
            transformRequest: data => {
                /* if form data, send as is */
                if (Object.prototype.toString.call(data) === '[object FormData]') {
                    return data;
                }
                /** send array as is */
                if (Object.prototype.toString.call(data) === '[object Array]') {
                    return JSON.stringify(data);
                }
                /** cut indexed keys from object */
                const res = {};
                Object.keys(data).forEach(key => {
                    if (!Number(key)) {
                        res[key] = data[key];
                    }
                });
                return JSON.stringify(res);
            },
            headers,
        })
            .then(this.checkStatus)
            .then(response => response.data);
    };
}

class RedcarpetUpAPI extends Base{
    constructor(options){
        super(options)
        const {apiKey, productType, appVersion,devMode}=options;
        this.BASE_URL = devMode?"https://apicherry-v3.redcarpetup.com/":"https://api.redcarpetup.com/";
        this.resourceId = apiKey || '';
        this.productType = productType || '';
        this.appVersion = appVersion || '';
        this.addResource();
    }

    isOk(){
        console.log('i am working');
    }

    addResource(){
        Object.assign(this,{
            payment:require('./lib/resources/payments')(this),
            auth:require('./lib/resources/auth')(this),
            user:require('./lib/resources/user'),
        })
    }

    getOtp({ phone }) {
        return this.callApi(
            "/user_mobile_signup",
            "GET",
            {
                mobile: phone,
                resource_id: this.resourceId,
            },
            phone
        );
    }

        verifyOtp = async function ({ otp, phone }) {
        const response = await this.callApi(
            "/user_mobile_verify",
            "GET",
            {
                mobile: phone,
                code: otp,
                resource_id: this.resourceId,
            },
            phone
        );
        if (response.result === "success") {
            await this.callApi(
                "/set_branch_data",
                "POST",
                { skipReferral: true, utm_medium: this.productType },
                phone,
                response.access_token
            );
            return response;
        } else {
            console.log('error');
            throw new Error(response.message);
        }
    }

        setUserPersonalInfo = function ({ pincode, work, addressType, email, phone, accessToken }) {
        return this.callApi(
            "/set_personal_info",
            "POST",
            {
                pincode: pincode,
                occupation: work,
                address_type: addressType,
                email: email,
            },
            phone,
            accessToken
        );
    }

        getUserStatus = function ({ phone, accessToken }) {
        return this.callApi(
            `/user_products_and_states/${this.productType}`,
            "GET",
            {},
            phone,
            accessToken
        );
    }

    getUserCardDetails = function ({ phone, accessToken }) {
        return this.callApi(
            "/get_user_card_details",
            "GET",
            {},
            phone,
            accessToken
        );
    }

    getUserProfile = function ({ phone, accessToken }) {
        return this.callApi(
            "/get_new_user_profile",
            "GET",
            {},
            phone,
            accessToken
        );
    }

    selectProduct = function ({ phone, accessToken }) {
        return this.callApi(
            `/select_${this.productType}_as_a_product`,
            "GET",
            {},
            phone,
            accessToken
        );
    };


    verifyAadhaarCardOtp = function ({ phone, accessToken, otp, aadharNumber, clientId }) {
        return this.callApi(
            `/verify_aadhar_id_${this.productType}`,
            "POST",
            {
                otp: otp,
                type: "verify",
                client_id: clientId,
                aadhar_no: aadharNumber,
            },
            phone,
            accessToken
        );
    }

    generateAadhaarOtpToVerify = function ({ phone, accessToken, aadharNumber, pincode, work, email, addressType }) {
        return this.callApi(
            `/verify_aadhar_id_${this.productType}`,
            "POST",
            {
                pincode: pincode,
                occupation: work,
                address_type: addressType,
                aadhar_no: aadharNumber,
                type: "generate",
                email: email,
            },
            phone,
            accessToken
        );
    }

    setUserPanCard = function ({ phone, pan, accessToken }) {
        return this.callApi(
            `/set_pan_${this.productType}`,
            "POST",
            {
                pan
            },
            phone,
            accessToken
        );
    }

    acceptUserAgreementEsign = function ({ phone, accessToken }) {
        return this.callApi(
            `/accept_user_agreement_esign_${this.productType}`,
            "GET",
            {},
            phone,
            accessToken
        );
    }

    generateUserEsign = function ({ phone, accessToken }) {
        return this.callApi(
            `/generate_user_esign_${this.productType}`,
            "GET",
            {},
            phone,
            accessToken
        );
    }

    getUserDocuments = function ({ userProductId, phone, accessToken }) {
        return this.callApi(
            "/get_user_documents",
            "GET",
            {
                user_product_id: userProductId,
            },
            phone,
            accessToken
        );
    }

    userDocsToUpload = function ({ phone, accessToken }) {
        return this.callApi(
            "/docs_for_upload",
            "GET",
            {
                docs_for: this.productType
            },
            phone,
            accessToken
        );
    }

    uploadUserDocument = function ({ documentType, deviceId, imeiNo, document_sequence, url, userProductId, phone, accessToken }) {
        return this.callApi(
            `/set_user_profile_ids_${this.productType}`,
            "POST",
            {
                type: documentType,
                deviceId: deviceId || "",
                imeiNo: imeiNo || "",
                document_sequence: document_sequence,
                product_type: this.productType,
                confirm_upload: false,
                url: url,
                user_product_id: userProductId,
            },
            phone,
            accessToken
        );
    }

    confirmUserDocUpload = function ({ userProductId, phone, accessToken }) {
        return this.callApi(
            `/set_user_profile_ids_${this.productType}`,
            "POST",
            {
                confirm_upload: true,
                product_type: this.productType,
                user_product_id: userProductId,
            },
            phone,
            accessToken
        );
    }

    activateUserCard = function ({ phone, accessToken, userProductId }) {
        return this.callApi(
            `/create_activity_for_${this.productType}`,
            "POST",
            {
                product_id: userProductId,
            },
            phone,
            accessToken
        );
    }

    getUserStatements = function ({ loanId, phone, accessToken }) {
        return this.callApi(
            "/get_statement/" + loanId,
            "GET",
            {
                source: "ledger",
                product_type: this.productType,
            },
            phone,
            accessToken
        );
    }

    sendBlockUnblockCardOtp = function ({ phone, accessToken }) {
        return this.callApi(
            "/send_user_otp",
            "POST",
            { source_type: "lk_ul_card" },
            phone,
            accessToken
        );
    }

    blockUnblockUserCard = function ({ phone, accessToken, cardStatus, kitNumber, otp }) {
        return this.callApi(
            "/card_operations_app",
            "POST",
            {
                operation: cardStatus == "ACTIVE" ? "L" : "UL",
                card_kit_number: kitNumber,
                otp: otp,
            },
            phone,
            accessToken
        );
    }

    getCardSettings = function ({ phone, accessToken, kitNumber }) {
        return this.callApi(
            "/get_card_settings",
            "GET",
            { kit_number: kitNumber },
            phone,
            accessToken
        );
    }

    setCardSettings = function ({ phone, accessToken, kitNumber, currentDailySpendLimit, singleTxnLimit, currentDailyTxn }) {
        return this.callApi(
            "/set_card_settings",
            "POST",
            {
                kit_number: kitNumber,
                current_daily_txn: currentDailyTxn,
                single_txn_limit: singleTxnLimit,
                current_daily_spend_limit: currentDailySpendLimit,
            },
            phone,
            accessToken
        );
    }

    sendUserResetPinOtp = function ({ phone, accessToken }) {
        return this.callApi(
            "/send_user_otp",
            "POST",
            { source_type: "card_cvv" },
            phone,
            accessToken
        );
    }

    setPin = function ({ phone, accessToken, kitNumber, otp, pin,dob }) {
        return this.callApi(
            "/set_card_pin",
            "POST",
            {
                pin: pin,
                dob: moment(dob).format("DDMMYYYY"),
                otp: otp,
                kit_no: kitNumber,
            },
            phone,
            accessToken
        );
    }

    createPaymentRequest = function ({ phone, accessToken, amount, value, type, userProductId }) {
        return this.callApi(
            "/ledger_create_payment_request",
            "POST",
            {
                payment_data: {
                    amount,
                    value,
                    type,
                    extra_details: {
                        user_product_id: userProductId,
                    }
                },
            },
            phone,
            accessToken
        );
    }

        capturePayment = function ({ paymentRequestId, phone, accessToken, razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
        return this.callApi(
            "/capture_razorpay_payment",
            "POST",
            {
                payment_request_id: paymentRequestId,
                razorpay_payment_id: razorpayPaymentId,
                razorpay_signature: razorpaySignature,
                razorpay_order_id: razorpayOrderId,
            },
            phone,
            accessToken
        );
    }

}

module.exports = RedcarpetUpAPI;