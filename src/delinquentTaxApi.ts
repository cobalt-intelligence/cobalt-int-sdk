import axios from 'axios';

export interface GetDelinquentTaxInput {
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
     * Total tax due greater than this number.
     */
    greaterThan?: number;
    /**
     * Total tax due less than this number.
     */
    lessThan?: number;
    /**
     * The total tax dude
     */
    totalDue?: number;
    /**
     * Which years the parcel is delinquent.
     * Something like [2018, 2019]
     */
    delinquentYears?: number[];
}

export class DelinquentTaxApi {
    constructor(private apiKey: string) { }

    public async getDelinquentTaxes(getDelinquentTaxInput: GetDelinquentTaxInput, records: any[] = []) {
        let url = `https://apigateway.cobaltintelligence.com/taxDelinquent?`;

        if (!getDelinquentTaxInput.nextPageKey
            && !getDelinquentTaxInput.county
            && !getDelinquentTaxInput.state) {
            return { message: 'Either county or state is required.' };
        }

        const searchParams = new URLSearchParams(getDelinquentTaxInput as any);

        url += searchParams.toString();

        const axiosResponse = await axios.get(url, {
            headers: {
                'x-api-key': this.apiKey
            }
        });

        records.push(...axiosResponse.data.records);

        if (axiosResponse.data.nextPageKey) {
            console.log('Getting next page of records. Total records so far', records.length);

            const stringifiedNextPageKey = JSON.stringify(axiosResponse.data.nextPageKey);

            delete getDelinquentTaxInput.nextPageKey;

            return await this.getDelinquentTaxes({
                nextPageKey: stringifiedNextPageKey,
                ...getDelinquentTaxInput
            }, records);
        }

        return { totalRecords: records.length, records: records };
    }

}