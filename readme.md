# Cobalt Intelligence SDK

This package assists in accessing the APIs provided by Cobalt Intelligence.

## Getting Started

`npm install --save cobalt-int-sdk`

View full API documentation here - https://cobaltintelligence.stoplight.io/docs/cobalt-intelligence/b3A6MjAxODIxMDU-secretary-of-state-api

See examples here - https://github.com/cobalt-intelligence/cobalt-int-sdk/blob/master/src/example.ts

This will make the request to the API and handle any long polling or pagination.

Three different APIs are supported:

[Secretary Of State API](#secretary-of-state-api)

## Secretary of State API

Get your API key here - https://cobaltintelligence.com/secretary-of-state

With your API key, initialize the package:

`const sosApi = new SosApi(process.env.cobaltIntApiKey);`

Get business details from the SosApi:

`const details = await sosApi.getBusinessDetails(businessName, state);`

By default the API will search its database for the business. If it doesn't find it, it will query the state directly.

You can also force the API to query live data by adding the liveData parameter. This will ensure you have the most up to date data but takes considerably longer.

```
const liveData = true;
const details = await sosApi.getBusinessDetails(businessName, state, liveData);
```
### `getBusinessDetails`

This is allows you to search by business name and state.

```
const sosApi = new SosApi(process.env.cobaltIntApiKey);

const details = await sosApi.getBusinessDetails('Pizza McPizza LLC', 'missouri');

console.log('details', details);
```

### `getBusinessDetailsBySosId`

This is allows you to search by the secretary of state id and state.

```
const sosApi = new SosApi(process.env.cobaltIntApiKey);

const details = await sosApi.getBusinessDetailsBySosId('723472347', 'idaho');

console.log('details', details);
```
### `searchAllStatesByBusinessName`

This function allows you to send a business name and search all available states for instances of this business.

```
const sosApi = new SosApi(process.env.cobaltIntApiKey);

const results = await sosApi.searchAllStatesByBusinessName('pizza hut llc');

console.log('Results', results);
```

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

