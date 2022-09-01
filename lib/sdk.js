"use strict";
const moment = require("moment");
const callApi = require("./helpers");

class RedcarpetUpAPI {
  constructor(options) {
    const { apiKey, productType, devMode } = options;
    const urlToUse = devMode
      ? "https://api-v3.redcarpetup.com/"
      : "https://api.redcarpetup.com/";
    console.log(urlToUse);
    this.BASE_URL = urlToUse;
    this.resourceId = apiKey || "";
    this.productType = productType || "";
    this.data = {
      resourceId: apiKey || "",
      appVersion: "5.011",
      productType: productType || "",
      baseUrl: urlToUse,
    };
  }

  isOk() {
    return callApi(
      "/test",
      "GET",
      {},
      { ...this.data }
    );
  }

  getOtp({ phone }) {
    return callApi(
      "/user_mobile_signup",
      "GET",
      {
        mobile: phone,
        resource_id: this.resourceId,
      },
      { ...this.data, phone }
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
      { ...this.data, phone }
    );
    if (response.result === "success") {
      const setBranchData = await callApi(
        "/set_branch_data",
        "POST",
        { skipReferral: true, utm_medium: this.productType },
        { ...this.data, accessToken: response.accessToken }
      );
      if (setBranchData.result === "success")
        return response;
      else
        throw new Error(setBranchData.message);
    } else
      throw new Error(response.message);
  };

  setUserPersonalInfo = function ({
    pincode,
    work,
    addressType,
    email,
    phone,
    accessToken,
  }) {
    return callApi(
      "/set_personal_info",
      "POST",
      {
        pincode: pincode,
        occupation: work,
        address_type: addressType,
        email: email,
      },
      { ...this.data, accessToken }
    );
  };

  getUserStatus = function ({ phone, accessToken }) {
    return callApi(
      `/user_products_and_states/${this.productType}`,
      "GET",
      {},
      { ...this.data, accessToken }
    );
  };

  getUserCardDetails = function ({ phone, accessToken }) {
    return callApi("/get_user_card_details", "GET", {}, {
      ...this.data,
      accessToken,
    });
  };

  getUserProfile = function ({ phone, accessToken }) {
    return callApi("/get_new_user_profile", "GET", {}, {
      ...this.data,
      accessToken,
    });
  };

  selectProduct = function ({ phone, accessToken }) {
    return callApi(
      `/select_${this.productType}_as_a_product`,
      "GET",
      {},
      { ...this.data, accessToken }
    );
  };

  verifyAadhaarCardOtp = function ({
    phone,
    accessToken,
    otp,
    aadharNumber,
    clientId,
  }) {
    return callApi(
      `/verify_aadhar_id_${this.productType}`,
      "POST",
      {
        otp: otp,
        type: "verify",
        client_id: clientId,
        aadhar_no: aadharNumber,
      },
      { ...this.data, accessToken }
    );
  };

  verifyMailOtp = function ({ phone, accessToken, otp }) {
    return callApi(
      `/verify_mail_otp`,
      "POST",
      {
        otp,
      },
      { ...this.data, accessToken }
    );
  };

  generateyMailOtpToVerify = function ({ phone, accessToken, type, email }) {
    return callApi(
      `/send_verification_mail_otp_app`,
      "POST",
      {
        type,
        email,
      },
      { ...this.data, accessToken }
    );
  };

  generateAadhaarOtpToVerify = function ({
    phone,
    accessToken,
    aadharNumber,
    pincode,
    work,
    email,
    addressType,
  }) {
    return callApi(
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
      { ...this.data, accessToken }
    );
  };

  setUserPanCard = function ({ phone, pan, accessToken }) {
    return callApi(
      `/set_pan_${this.productType}`,
      "POST",
      {
        pan,
      },
      { ...this.data, accessToken }
    );
  };

  acceptUserAgreementEsign = function ({ phone, accessToken }) {
    return callApi(
      `/accept_user_agreement_esign_${this.productType}`,
      "GET",
      {},
      { ...this.data, accessToken }
    );
  };

  generateUserEsign = function ({ phone, accessToken }) {
    return callApi(
      `/generate_user_esign_${this.productType}`,
      "GET",
      {},
      { ...this.data, accessToken }
    );
  };

  getUserDocuments = function ({ userProductId, phone, accessToken }) {
    return callApi(
      "/get_user_documents",
      "GET",
      {
        user_product_id: userProductId,
      },
      { ...this.data, accessToken }
    );
  };

  getPhotoUploadDetails = function ({ phone, accessToken, documentType }) {
    return callApi(
      `/photoupload${documentType === "video" ? "?type=mp4" : ""}`,
      "GET",
      {},
      { ...this.data, accessToken }
    );
  };

  userDocsToUpload = function ({ phone, accessToken }) {
    return callApi(
      "/docs_for_upload",
      "GET",
      {
        docs_for: this.productType,
      },
      { ...this.data, accessToken }
    );
  };

  uploadUserDocument = function ({
    documentType,
    deviceId,
    imeiNo,
    document_sequence,
    url,
    userProductId,
    phone,
    accessToken,
  }) {
    return callApi(
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
      { ...this.data, accessToken }
    );
  };

  confirmUserDocUpload = function ({ userProductId, phone, accessToken }) {
    return callApi(
      `/set_user_profile_ids_${this.productType}`,
      "POST",
      {
        confirm_upload: true,
        product_type: this.productType,
        user_product_id: userProductId,
      },
      { ...this.data, accessToken }
    );
  };

  activateUserCard = function ({ phone, accessToken, userProductId }) {
    return callApi(
      `/create_activity_for_${this.productType}`,
      "POST",
      {
        product_id: userProductId,
      },
      { ...this.data, accessToken }
    );
  };

  getUserStatements = function ({ loanId, phone, accessToken }) {
    return callApi(
      "/get_statement/" + loanId,
      "GET",
      {
        source: "ledger",
        product_type: this.productType,
      },
      { ...this.data, accessToken }
    );
  };

  sendBlockUnblockCardOtp = function ({ phone, accessToken }) {
    return callApi(
      "/send_user_otp",
      "POST",
      { source_type: "lk_ul_card" },
      { ...this.data, accessToken }
    );
  };

  blockUnblockUserCard = function ({
    phone,
    accessToken,
    cardStatus,
    kitNumber,
    otp,
  }) {
    return callApi(
      "/card_operations_app",
      "POST",
      {
        operation: cardStatus == "ACTIVE" ? "L" : "UL",
        card_kit_number: kitNumber,
        otp: otp,
      },
      { ...this.data, accessToken }
    );
  };

  getCardSettings = function ({ phone, accessToken, kitNumber }) {
    return callApi(
      "/get_card_settings",
      "GET",
      { kit_number: kitNumber },
      { ...this.data, accessToken }
    );
  };

  getLatestPaymentStatus = function ({ phone, accessToken, paymentType }) {
    return callApi(
      "/check_latest_payment_status",
      "GET",
      {
        payment_type: paymentType,
      },
      { ...this.data, accessToken }
    );
  };

  checkDeliveryFunnelStatus = function ({ phone, accessToken, productType }) {
    return callApi(
      "/check_delivery_funnel_status",
      "POST",
      {
        product_type: productType,
      },
      { ...this.data, accessToken }
    );
  };

  getPaymentAmountForRedCarpet = function ({ phone, accessToken }) {
    return callApi(
      "/check_payment_amount_for_redcarpet_gimbooks",
      "GET",
      {},
      { ...this.data, accessToken }
    );
  };

  setCardSettings = function ({
    phone,
    accessToken,
    kitNumber,
    currentDailySpendLimit,
    singleTxnLimit,
    currentDailyTxn,
  }) {
    return callApi(
      "/set_card_settings",
      "POST",
      {
        kit_number: kitNumber,
        current_daily_txn: currentDailyTxn,
        single_txn_limit: singleTxnLimit,
        current_daily_spend_limit: currentDailySpendLimit,
      },
      { ...this.data, accessToken }
    );
  };

  sendUserResetPinOtp = function ({ phone, accessToken }) {
    return callApi(
      "/send_user_otp",
      "POST",
      { source_type: "card_cvv" },
      { ...this.data, accessToken }
    );
  };

  setPin = function ({ phone, accessToken, kitNumber, otp, pin, dob }) {
    return callApi(
      "/set_card_pin",
      "POST",
      {
        pin: pin,
        dob: moment(dob).format("DDMMYYYY"),
        otp: otp,
        kit_no: kitNumber,
      },
      { ...this.data, accessToken }
    );
  };

  createPaymentRequest = function ({
    phone,
    accessToken,
    amount,
    value,
    type,
    userProductId,
  }) {
    return callApi(
      "/ledger_create_payment_request",
      "POST",
      {
        payment_data: {
          amount,
          value,
          type,
          extra_details: {
            user_product_id: userProductId,
          },
        },
      },
      { ...this.data, accessToken }
    );
  };

  capturePayment = function ({
    paymentRequestId,
    phone,
    accessToken,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  }) {
    return callApi(
      "/capture_razorpay_payment",
      "POST",
      {
        payment_request_id: paymentRequestId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
        razorpay_order_id: razorpayOrderId,
      },
      { ...this.data, accessToken }
    );
  };
}

module.exports = RedcarpetUpAPI;
