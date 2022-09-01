# Redcarpet SDK

## Installation

```bash
npm i rc_sdk_gm
```

```bash
yarn add rc_sdk_gm
```
## Documentation

Documentation of Redcarpet API and their usage 

### Basic Usage

Instantiate the redcarpet instance with `apiKey` , `productType` & `productVersion`. You can obtain the keys from the redcarpet website.

```js

const RedcarpetUpAPI = require('rc_sdk_gm');

var instance = new RedcarpetUpAPI({
    productType: "your-product-type",
    apiKey: "your-api-key",
});
```

The resources can be accessed via the instance. All the methods invocations follows the namespaced signature

```js
// API signature
// {redcarpt Instance}.{methodName}

// example
instance.getOtp({
    phone:'XXXXXXXXXX'
});
```

Every resource method returns a promise.

```js
instance.verifyOtp({
    phone: 'XXXXXXXXXX',
    otp: '234343',
  })
  .then(response => {
    // handle success
  })
  .catch(error => {
    // handle error
  });
```

## Licence

MIT Licensed. See [LICENSE.txt](LICENSE.txt) for more details