import axios from 'axios';

export interface GetDelinquentTaxInput {
    nextPageKey?: any;
    taxAccountNumber?: string;
    state?: string;
    county?: string;
    greaterThan?: number;
    lessThan?: number;
    totalDue?: number;
    /**
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