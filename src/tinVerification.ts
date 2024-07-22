import axios from 'axios';

interface ITINResponseBody {
    /**
     * The submitted name of the business.
     */
    name: string;
    /**
     * The submitted TIN.
     */
    tin: string;
    /**
     * The status of the TIN verifiation, whether it matched or not.
     */
    status: string;
    /**
     * The IRS code returned from the verification.
     */
    irsCode: number;
    /**
     * The IRS reason returned from the verification.
     */
    irsReason: string;
    irsServiceStatus: string;
    lastIRSCheckDate: string;
}

export class TINVerification {
    constructor(private apiKey: string) { }

    public async verifyTIN(tin: string, businessName: string): Promise<ITINResponseBody> {
        const url = `https://apigateway.cobaltintelligence.com/tinVerification?tin=${tin}&businessName=${businessName}`;

        const axiosResponse = await axios.get(url, {
            headers: {
                'x-api-key': this.apiKey
            }
        });

        return axiosResponse.data;
    }
}