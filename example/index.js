const RedcarpetUpAPI = require('../index');

const redcarpetUpApi = new RedcarpetUpAPI({
    productType: "your_product_type",
    apiKey: "your_api_key",
});

redcarpetUpApi.isOk().then(console.log).catch(console.error);

redcarpetUpApi.getOtp({ phone: "" }).then(console.log).catch(console.error);
