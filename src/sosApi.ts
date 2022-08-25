import axios from 'axios';
import { IBusiness, IResponseBody } from 'cobalt-int-common';

export class SosApi {
    constructor(private apiKey: string, private targetedEnvironment = null) { }

    /**
     * This function will handle any long polling and return the business details of any business
     * if found.
     * @param businessName 
     * @param state 
     * @returns 
     */
    public async getBusinessDetails(businessName: string, state: string, liveData?: boolean, screenshot?: boolean, uccData?: boolean, street?: string, city?: string, zip?: string): Promise<IResponseBody> {
        let url = `https://apigateway.cobaltintelligence.com/v1/search?searchQuery=${encodeURIComponent(businessName)}&state=${state}`;

        if (this.targetedEnvironment) {
            url = `https://apigateway.cobaltintelligence.com/${this.targetedEnvironment}/search?searchQuery=${encodeURIComponent(businessName)}&state=${state}`;
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
            url += `&street=${street}`;
        }

        if (city) {
            url += `&city=${city}`;
        }

        if (zip) {
            url += `&zip=${zip}`;
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
    public async getBusinessDetailsBySosId(sosId: string, state: string, liveData?: boolean, screenshot?: boolean, uccData?: boolean, street?: string, city?: string, zip?: string): Promise<IResponseBody> {
        let url = `https://apigateway.cobaltintelligence.com/v1/search?sosId=${encodeURIComponent(sosId)}&state=${state}`;

        if (this.targetedEnvironment) {
            url = `https://apigateway.cobaltintelligence.com/${this.targetedEnvironment}/search?sosId=${encodeURIComponent(sosId)}&state=${state}`;
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
            url += `&street=${street}`;
        }

        if (city) {
            url += `&city=${city}`;
        }

        if (zip) {
            url += `&zip=${zip}`;
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
    * @param firstname
    * @param lastname 
    * @param state 
    * @returns 
    */
    public async getBusinessDetailsByName(firstname: string, lastname: string, state: string, liveData?: boolean, screenshot?: boolean, uccData?: boolean, street?: string, city?: string, zip?: string): Promise<IResponseBody> {
        const fullName = `${firstname}, ${lastname}`.trim();
        let url = `https://apigateway.cobaltintelligence.com/v1/search?searchByPersonQuery=${encodeURIComponent(fullName)}&state=${state}`;

        if (this.targetedEnvironment) {
            url = `https://apigateway.cobaltintelligence.com/${this.targetedEnvironment}/search?searchByPersonQuery=${encodeURIComponent(fullName)}&state=${state}`;
        }

        if (liveData) {
            url += '&liveData=true';
        }

        if (screenshot) {
            url += '&screenshot=true';
        }

        if (uccData) {
            url += '&uccData=true';
        }

        if (street) {
            url += `&street=${street}`;
        }

        if (city) {
            url += `&city=${city}`;
        }

        if (zip) {
            url += `&zip=${zip}`;
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

        // Functions timeout after 90 attempts
        if (retryCount > 90) {
            return { message: 'Passed 90 attempts of retries. Something must have gone wrong. Sorry.' };
        }

        if (axiosResponse.data?.status === 'Incomplete') {
            console.log('Retrying. Total retry attempts', retryCount);
            retryCount++;
            // Item not ready yet
            // We wait 10 seconds and then try again
            await this.timeout(10000);
            return await this.retryBusinessDetails(retryId, retryCount, screenshot);
        }

        return axiosResponse.data;
    }

    private timeout(ms: number) {
        return new Promise(res => setTimeout(res, ms));
    }
}