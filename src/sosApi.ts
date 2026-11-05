import axios from 'axios';
import { IBusiness, IResponseBody } from 'cobalt-int-common';

/** A verification that can ride along with a business search when the account's plan includes it. */
export type SosInclude = 'ucc' | 'ofac' | 'tin';

/**
 * The include= bundle for getBusinessDetails and getBusinessDetailsBySosId. An include the account's plan carries is
 * free with the search; one it does not carry still runs and is billed at that product's standalone rate when it
 * succeeds. The outcome of each include sits on results[0] (uccData/uccSucceeded, ofac/ofacSucceeded/ofacMessage,
 * tinVerification/tinSucceeded/tinMessage).
 */
export interface SosIncludeOptions {
    /** Which verifications to run with the search. */
    include: SosInclude[];
    /** Required when include has 'tin': the nine-digit EIN/TIN to match against the business's legal name. Echoed back masked. */
    tin?: string;
    /** OFAC pass-throughs, used when include has 'ofac'. Defaults: every type, score 95, the standard source list. */
    ofacSearchType?: 'organization' | 'person' | 'vessel' | 'aircraft';
    ofacScore?: number;
    ofacSources?: string[];
}

export class SosApi {
    constructor(private apiKey: string, private targetedEnvironment = null) { }

    /**
     * This function will handle any long polling and return the business details of any business
     * if found.
     * @param businessName
     * @param state
     * @param includeOptions verifications to run with the search (include=ucc,ofac,tin), when the account's plan carries them
     * @returns
     */
    public async getBusinessDetails(businessName: string, state: string, liveData?: boolean, screenshot?: boolean, uccData?: boolean, street?: string, city?: string, zip?: string, callbackUrl?: string, nameAvailabilityCheck?: boolean, findRelatedBusinesses?: boolean, includeOptions?: SosIncludeOptions): Promise<IResponseBody> {
        let url = `https://apigateway.cobaltintelligence.com/v1/search?searchQuery=${encodeURIComponent(businessName)}&state=${state}`;

        if (this.targetedEnvironment) {
            url = `https://apigateway.cobaltintelligence.com/${this.targetedEnvironment}/search?searchQuery=${encodeURIComponent(businessName)}&state=${state}`;
        }

        url += this.includeQuery(includeOptions);

        if (liveData === false) {
            url += '&liveData=false';
        }

        if (screenshot) {
            url += '&screenshot=true';
        }

        if (uccData) {
            url += '&uccData=true';
        }

        if (street) {
            url += `&street=${encodeURIComponent(street)}`;
        }

        if (city) {
            url += `&city=${encodeURIComponent(city)}`;
        }

        if (zip) {
            url += `&zip=${encodeURIComponent(zip)}`;
        }

        if (callbackUrl) {
            url += `&callbackUrl=${encodeURIComponent(callbackUrl)}`;
        }

        if (nameAvailabilityCheck) {
            url += '&nameAvailabilityCheck=true';
        }

        if (findRelatedBusinesses) {
            url += `&findRelatedBusinesses=true`;
        }

        const axiosResponse = await axios.get(url, {
            headers: {
                'x-api-key': this.apiKey
            }
        });

        // This will take longer
        if (axiosResponse.data?.retryId) {
            return await this.retryBusinessDetails(axiosResponse.data.retryId, 0, screenshot);
        }

        return axiosResponse.data;
    }

    /**
     * This function will handle any long polling and return the business details of any business
     * if found.
     * @param sosId 
     * @param state 
     * @returns 
     */
    public async getBusinessDetailsBySosId(sosId: string, state: string, liveData?: boolean, screenshot?: boolean, uccData?: boolean, street?: string, city?: string, zip?: string, searchQuery?: string, callbackUrl?: string, nameAvailabilityCheck?: boolean, findRelatedBusinesses?: boolean, includeOptions?: SosIncludeOptions): Promise<IResponseBody> {
        let url = `https://apigateway.cobaltintelligence.com/v1/search?sosId=${encodeURIComponent(sosId)}&state=${state}`;

        if (this.targetedEnvironment) {
            url = `https://apigateway.cobaltintelligence.com/${this.targetedEnvironment}/search?sosId=${encodeURIComponent(sosId)}&state=${state}`;
        }

        url += this.includeQuery(includeOptions);

        if (searchQuery) {
            url += `&searchQuery=${encodeURIComponent(searchQuery)}`;
        }

        if (liveData === false) {
            url += '&liveData=false';
        }

        if (screenshot) {
            url += '&screenshot=true';
        }

        if (uccData) {
            url += '&uccData=true';
        }

        if (street) {
            url += `&street=${encodeURIComponent(street)}`;
        }

        if (city) {
            url += `&city=${encodeURIComponent(city)}`;
        }

        if (zip) {
            url += `&zip=${encodeURIComponent(zip)}`;
        }

        if (callbackUrl) {
            url += `&callbackUrl=${encodeURIComponent(callbackUrl)}`;
        }

        if (nameAvailabilityCheck) {
            url += '&nameAvailabilityCheck=true';
        }

        if (findRelatedBusinesses) {
            url += `&findRelatedBusinesses=true`;
        }

        const axiosResponse = await axios.get(url, {
            headers: {
                'x-api-key': this.apiKey
            }
        });

        // This will take longer
        if (axiosResponse.data?.retryId) {
            return await this.retryBusinessDetails(axiosResponse.data.retryId, 0, screenshot);
        }

        return axiosResponse.data;
    }

    /**
     * This function will handle any long polling and return the business details of any business
     * if found.
     * @param sosId
     * @param state
     * @returns
     */
    public async getListBySearchQuery(businessName: string, state: string, liveData?: boolean): Promise<IResponseBody> {
        let url = `https://apigateway.cobaltintelligence.com/v1/search/list?searchQuery=${encodeURIComponent(businessName)}&state=${state}`;

        if (this.targetedEnvironment) {
            url = `https://apigateway.cobaltintelligence.com/${this.targetedEnvironment}/search/list?searchQuery=${encodeURIComponent(businessName)}&state=${state}`;
        }

        if (liveData === false) {
            url += '&liveData=false';
        }

        const axiosResponse = await axios.get(url, {
            headers: {
                'x-api-key': this.apiKey
            }
        });

        // This will take longer
        if (axiosResponse.data?.retryId) {
            return await this.retryBusinessDetails(axiosResponse.data.retryId, 0);
        }

        return axiosResponse.data;
    }

    /**
     * This function allows you to send a business name and search all available states for instances
     * of this business.
     * @param businessName 
     * @returns 
     */
    public async searchAllStatesByBusinessName(businessName: string) {
        // Get all available states from sos-search-index
        const indexUrl = 'https://apigateway.cobaltintelligence.com/v1/search/index';

        const indexAxiosResponse = await axios.get(indexUrl, {
            headers: {
                'x-api-key': this.apiKey
            }
        });

        const states: { functionName: string; }[] = indexAxiosResponse.data;

        const results: { state: string; result: IBusiness | string }[] = [];
        const promises: any[] = [];

        for (let i = 0; i < states.length; i++) {
            const state = states[i].functionName.split('-')[0];

            promises.push(this.getBusinessDetails(businessName, state).then((result) => {
                console.log('Results from', state, result);
                results.push({
                    state: state,
                    result: result.results?.length > 0 ? result.results[0] : result.status
                });
            }));
        }

        await Promise.all(promises);

        return results;
    }

    /**
    * This function will handle any long polling and return the business details of any business
    * if found.
    * @param firstName
    * @param lastName 
    * @param state 
    * @returns 
    */
    public async getDetailsByPersonName(firstName: string, lastName: string, state: string, liveData?: boolean, screenshot?: boolean, uccData?: boolean, street?: string, city?: string, zip?: string, callbackUrl?: string, nameAvailabilityCheck?: boolean, findRelatedBusinesses?: boolean): Promise<IResponseBody> {

        let url = `https://apigateway.cobaltintelligence.com/v1/search?searchByPersonFirstName=${encodeURIComponent(firstName)}&searchByPersonLastName=${encodeURIComponent(lastName)}&state=${state}`;

        if (this.targetedEnvironment) {
            url = `https://apigateway.cobaltintelligence.com/${this.targetedEnvironment}/search?searchByPersonFirstName=${encodeURIComponent(firstName)}&searchByPersonLastName=${encodeURIComponent(lastName)}&state=${state}`;
        }

        if (liveData === false) {
            url += '&liveData=false';
        }

        if (screenshot) {
            url += '&screenshot=true';
        }

        if (uccData) {
            url += '&uccData=true';
        }

        if (street) {
            url += `&street=${encodeURIComponent(street)}`;
        }

        if (city) {
            url += `&city=${encodeURIComponent(city)}`;
        }

        if (zip) {
            url += `&zip=${encodeURIComponent(zip)}`;
        }

        if (callbackUrl) {
            url += `&callbackUrl=${encodeURIComponent(callbackUrl)}`;
        }

        if (nameAvailabilityCheck) {
            url += '&nameAvailabilityCheck=true';
        }

        if (findRelatedBusinesses) {
            url += `&findRelatedBusinesses=true`;
        }

        const axiosResponse = await axios.get(url, {
            headers: {
                'x-api-key': this.apiKey
            }
        });

        // This will take longer
        if (axiosResponse.data?.retryId) {
            return await this.retryBusinessDetails(axiosResponse.data.retryId, 0, screenshot);
        }

        return axiosResponse.data;
    }

    public async getAPIKeyUsage() {
        const url = 'https://apigateway.cobaltintelligence.com/v1/usage';
        // get the usage
        const axiosResponse = await axios.get(url, {
            headers: {
                'x-api-key': this.apiKey
            }
        });
        return axiosResponse.data;
    }


    private async retryBusinessDetails(retryId: string, retryCount = 0, screenshot?: boolean, uccData?: boolean, street?: string, city?: string, zip?: string) {
        let url = `https://apigateway.cobaltintelligence.com/v1/search?retryId=${retryId}`;

        if (this.targetedEnvironment) {
            url = `https://apigateway.cobaltintelligence.com/${this.targetedEnvironment}/search?retryId=${retryId}`;
        }

        if (screenshot) {
            url += '&screenshot=true';
        }

        const axiosResponse = await axios.get(url, {
            headers: {
                'x-api-key': this.apiKey
            }
        });

        // Functions timeout after 70 attempts
        if (retryCount > 70) {
            return { message: 'Passed 70 attempts of retries. Something must have gone wrong. Sorry.' };
        }

        if (axiosResponse.data?.status === 'Incomplete') {
            retryCount++;
            // Item not ready yet
            // We wait 10 seconds and then try again
            await this.timeout(10000);
            return await this.retryBusinessDetails(retryId, retryCount, screenshot);
        }

        return axiosResponse.data;
    }

    /** The include= bundle as query parameters, or an empty string when none was asked for. */
    private includeQuery(options?: SosIncludeOptions): string {
        if (!options?.include?.length) {
            return '';
        }
        let query = `&include=${encodeURIComponent(options.include.join(','))}`;
        if (options.tin) {
            query += `&tin=${encodeURIComponent(options.tin)}`;
        }
        if (options.ofacSearchType) {
            query += `&ofacSearchType=${encodeURIComponent(options.ofacSearchType)}`;
        }
        if (options.ofacScore !== undefined) {
            query += `&ofacScore=${encodeURIComponent(String(options.ofacScore))}`;
        }
        if (options.ofacSources?.length) {
            query += `&ofacSources=${encodeURIComponent(options.ofacSources.join(','))}`;
        }
        return query;
    }

    private timeout(ms: number) {
        return new Promise(res => setTimeout(res, ms));
    }
}
