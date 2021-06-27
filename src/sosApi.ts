import axios from 'axios';
import { IBusiness } from './models';

export class SosApi {
    constructor(private apiKey: string) { }

    /**
     * This function will handle any long polling and return the business details of any business
     * if found.
     * @param businessName 
     * @param state 
     * @returns 
     */
    public async getBusinessDetails(businessName: string, state: string) {
        const url = `https://apigateway.cobaltintelligence.com/search?searchQuery=${encodeURIComponent(businessName)}&state=${state}`;

        const axiosResponse = await axios.get(url, {
            headers: {
                'x-api-key': this.apiKey
            }
        });

        // This will take longer
        if (axiosResponse.data?.retryId) {
            return await this.retryBusinessDetails(axiosResponse.data.retryId);
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
    public async getBusinessDetailsBySosId(sosId: string, state: string) {
        const url = `https://apigateway.cobaltintelligence.com/search?sosId=${encodeURIComponent(sosId)}&state=${state}`;

        const axiosResponse = await axios.get(url, {
            headers: {
                'x-api-key': this.apiKey
            }
        });

        // This will take longer
        if (axiosResponse.data?.retryId) {
            return await this.retryBusinessDetails(axiosResponse.data.retryId);
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
        const indexUrl = 'https://apigateway.cobaltintelligence.com/search/index';

        const indexAxiosResponse = await axios.get(indexUrl, {
            headers: {
                'x-api-key': this.apiKey
            }
        });

        const states: {functionName: string;}[] = indexAxiosResponse.data;

        const results: any[] = [];
        const promises: any[] = [];

        for (let i = 0; i < states.length; i++) {
            const state = states[i].functionName.split('-')[0];

            promises.push(this.getBusinessDetails(businessName, state).then((result) => {
                console.log('Results from', state, result);
                results.push({
                    state: state,
                    result: result
                });
            }));            
        }

        await Promise.all(promises);

        return results;
    }

    private async retryBusinessDetails(retryId: string) {
        const url = `https://apigateway.cobaltintelligence.com/search?retryId=${retryId}`;

        const axiosResponse = await axios.get(url, {
            headers: {
                'x-api-key': this.apiKey
            }
        });

        if (axiosResponse.data?.message === 'Item not complete. Try again in a few moments.') {
            // Item not ready yet
            // We wait 10 seconds and then try again
            await this.timeout(10000);
            return await this.retryBusinessDetails(retryId);
        }

        return axiosResponse.data;
    }

    private timeout(ms: number) {
        return new Promise(res => setTimeout(res, ms));
    }
}