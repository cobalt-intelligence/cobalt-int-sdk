# Cobalt Intelligence SDK

This package assists in accessing the APIs provided by Cobalt Intelligence.

## Getting Started

`npm install --save cobalt-int-sdk`

Get your API key here - https://cobaltintelligence.com/secretary-of-state

With your API key, initialize the package:

`const sosApi = new SosApi(process.env.cobaltIntApiKey);`

Get business details from the SosApi:

`const details = await sosApi.getBusinessDetails(businessName, state);`

See examples here - https://github.com/cobalt-intelligence/cobalt-int-sdk/blob/master/src/example.ts

This will make the request to the API and handle any long polling.

### Prerequisites

Tested on Node v12.4.0 and NPM v6.9.0.

### Installing

`npm install --save cobalt-int-sdk`

## Built With

* [axios](https://github.com/axios/axios) - axios for web requests

## Authors

* **Jordan Hansen** - *Initial work* - [Jordan Hansen](https://github.com/cobalt-intelligence)


## License

This project is licensed under the ISC License

