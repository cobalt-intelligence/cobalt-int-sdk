# Cobalt Intelligence SDK

This package assists in accessing the APIs provided by Cobalt Intelligence.

## Getting Started

`npm install --save cobalt-int-sdk`

See examples here - https://github.com/cobalt-intelligence/cobalt-int-sdk/blob/master/src/example.ts

This will make the request to the API and handle any long polling or pagination.

## Secretary of State API

Get your API key here - https://cobaltintelligence.com/secretary-of-state

With your API key, initialize the package:

`const sosApi = new SosApi(process.env.cobaltIntApiKey);`

Get business details from the SosApi:

`const details = await sosApi.getBusinessDetails(businessName, state);`
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

## Delinquent Taxes API
Get your API key here - https://cobaltintelligence.com/real-estate

`const delinquentTaxApi = new DelinquentTaxApi(process.env.cobaltIntApiKey);`

### `getDelinquentTaxes`
This allows you to query for delinquent taxes in a specific county or state.

```
    const delinquentTaxApi = new DelinquentTaxApi(process.env.cobaltIntApiKey);

    const response = await delinquentTaxApi.getDelinquentTaxes({county: 'tarrant', greaterThan: 500});

    console.log('Records', response.totalRecords);
```

You'll pass a `GetDelinquentTaxInput` object to the function. Either a state or county parameter is required.

```
interface GetDelinquentTaxInput {
    /**
     * Used by the SDK. Users should ignore.
     */
    nextPageKey?: any;
    /**
     * Allows you to search by parcel id
     */
    taxAccountNumber?: string;
    /**
     * The state from which you wish to get parcels with delinquent taxes. Either this or county is required.
     */
    state?: string;
    /**
     * The county from which you wish to get parcels with delinquent taxes. Either this or state is required.
     */
    county?: string;
    /**
     * The city from which you wish to get parcels with delinquent taxes.
     */
    city?: string;
    /**
     * Total tax due greater than this number.
     */
    greaterThan?: number;
    /**
     * Total tax due less than this number.
     */
    lessThan?: number;
    /**
     * The total tax due.
     */
    totalDue?: number;
    /**
     * Which years the parcel is delinquent.
     * Something like [2018, 2019]
     */
    delinquentYears?: number[];
}
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

