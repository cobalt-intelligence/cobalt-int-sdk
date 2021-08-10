import axios from 'axios';
import { IParcel } from 'cobalt-int-common';

export class CountyAssessorApi {
    constructor(private apiKey: string) { }

    public async getParcelInformation(parcelNumber: string, county: string, state: string): Promise<IParcel> {       
        const url = `https://apigateway.cobaltintelligence.com/countyAssessor?county=${county}&state=${state}&parcelNumber=${parcelNumber}`;

        const axiosResponse = await axios.get(url, {
            headers: {
                'x-api-key': this.apiKey
            }
        });

        return axiosResponse.data; 
    }
}