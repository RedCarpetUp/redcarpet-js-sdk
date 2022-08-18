const RedcarpetUpAPI = require('../lib/index');

const RedcarpetUpAPI= require('redcarpetup-sdk');
// console.log(RedcarpetUpAPI.isOk());
const redcarpetUpApi = new RedcarpetUpAPI({
    productType: "your-product-type",
    apiKey: "api-key",
    appVersion: "app-version",
});

redcarpetUpApi.isOk();

//there are two ways to call api
redcarpetUpApi.getOtp()

//the other way

redcarpetUpApi.auth.getOtp();

