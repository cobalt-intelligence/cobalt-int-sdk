import axios from 'axios';
import { IBusiness } from './models';
import { Readable, Stream } from 'stream';

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