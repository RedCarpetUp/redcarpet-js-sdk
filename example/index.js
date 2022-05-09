const RedcarpetUpAPI = require('../lib').RedcarpetUpAPI;

const redcarpetUpApi = new RedcarpetUpAPI({
    productType: "your-product-type",
    resourceId: "your-resource-id",
    appVersion: "app-version",
});

const getUserProfile = (params) => {
    redcarpetUpApi.getUserProfile(params)
        .then(response => {
            if (response.result === "success") {
                console.log(response);
            } else {
                console.log(response.message);
            }
        })
        .catch(error => {
            console.log(error);
        });
};

const getUserCardDetails = (params) => {
    redcarpetUpApi.getUserCardDetails(params)
        .then(response => {
            // returns the list of cards user has disbursed
            if (response.result === "success") {
                console.log(response);
            } else {
                console.log(response.message);
            }
        })
        .catch(error => {
            console.log(error);
        });
};

const getUserStatements = (params) => {
    redcarpetUpApi.getUserStatements(params)
        .then(response => {
            // returns the list of statements -: Billed, Unbilled, Payments, Emis, etc.
            if (response.result === "success") {
                console.log(response);
            } else {
                console.log(response.message);
            }
        })
        .catch(error => {
            console.log(error);
        });
};

const createPaymentRequest = (params) => {
    redcarpetUpApi.createPaymentRequest(params)
        .then(response => {
            // returns payment data information key, id etc.
            if (response.result === "success") {
                console.log(response);
            } else {
                console.log(response.message);
            }
        })
        .catch(error => {
            console.log(error);
        });
};

const fulfillPaymentRequest = (params) => {
    redcarpetUpApi.capturePayment(params)
        .then(response => {
            if (response.result === "success") {
                console.log(response);
            } else {
                console.log(response.message);
            }
        })
        .catch(error => {
            console.log(error);
        });
};

const setUserPersonalInfo = (params) => {
    redcarpetUpApi.setUserPersonalInfo(params)
        .then(response => {
            if (response.result === "success") {
                console.log(response);
            } else {
                console.log(response.message);
            }
        })
        .catch(error => {
            console.log(error);
        });
};

const signUpUser = (params) => {
    redcarpetUpApi.getOtp(params)
        .then(response => {
            if (response.result === "success") {
                console.log(response);
            } else {
                console.log(response.message);
            }
        })
        .catch(error => {
            console.log(error);
        });
}

const verifyOtp = (params) => {
    redcarpetUpApi.verifyOtp(params)
        .then(response => {
            if (response.result === "success") {
                // users accessToken = response.access_token
                console.log(response);
            } else {
                console.log(response.message);
            }
        })
        .catch(error => {
            console.log(error);
        });
}

const getUserFunnelStatus = (params) => {
    redcarpetUpApi.getUserStatus(params)
        .then(response => {
            if (response.result === "success") {
                // userProductId = response.data[0].user_product_id
                // funnel = response.data[0].current_task
                console.log(response);
            } else {
                console.log(response.message);
            }
        })
        .catch(error => {
            console.log(error);
        });
}
