import axios from 'axios';
import { IParcel } from 'cobalt-int-common';

export class CountyAssessorApi {
    constructor(private apiKey: string, private targetedEnviroment = null) { }

    public async getParcelInformation(parcelNumber: string, county: string, state: string): Promise<IParcel> {       
        let url = `https://apigateway.cobaltintelligence.com/countyAssessor?county=${county}&state=${state}&parcelNumber=${parcelNumber}`;
        if (this.targetedEnviroment) {
            let url = `https://apigateway.cobaltintelligence.com/${this.targetedEnviroment}/countyAssessor?county=${county}&state=${state}&parcelNumber=${parcelNumber}`;
        }

        const axiosResponse = await axios.get(url, {
            headers: {
                'x-api-key': this.apiKey
            }
        });

        return axiosResponse.data; 
    }
}