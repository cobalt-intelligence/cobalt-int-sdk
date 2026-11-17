import axios from 'axios';

const TIN_VERIFICATION_URL = 'https://apigateway.cobaltintelligence.com/tinVerification';

/**
 * The status of a TIN verification.
 * - `TIN Matched`: the IRS matched the TIN and the business name.
 * - `Did Not Match`: the IRS did not match them, or the TIN is not currently issued.
 * - `Complete`: the IRS answered with neither a match nor a mismatch. `irsCode` and `irsReason` say what it answered.
 * - `Pending`: the IRS has not answered yet. Pass `retryId` to `retryTINVerification` to ask again.
 */
export type TINVerificationStatus = 'TIN Matched' | 'Did Not Match' | 'Complete' | 'Pending';

export interface ITINResponseBody {
    /**
     * The business name that was checked: cut to 40 characters, with punctuation other than `&` removed.
     */
    name: string;
    /**
     * The submitted TIN. A `retryTINVerification` answer carries the masked TIN, such as `XXXXX8139`.
     */
    tin: string;
    /**
     * The status of the TIN verification.
     */
    status: TINVerificationStatus;
    /**
     * The IRS code returned from the verification. Absent while the status is `Pending`.
     */
    irsCode?: number;
    /**
     * The IRS reason returned from the verification.
     */
    irsReason: string;
    /**
     * An empty string.
     */
    irsServiceStatus: string;
    /**
     * An empty string.
     */
    lastIRSCheckDate: string;
    /**
     * Present when the status is `Pending`. Pass it to `retryTINVerification` to ask again for the result.
     */
    retryId?: string;
    /**
     * The retry instructions on a `Pending` answer, and a notice when the business name was cut to 40 characters.
     */
    message?: string;
}

/**
 * The body of an answer other than 200, such as 400, 404 or 500.
 */
export interface ITINErrorResponseBody {
    message: string;
}

export class TINVerification {
    constructor(private apiKey: string) { }

    /**
     * Checks a TIN and a business name with the IRS.
     * Resolves with the answer. A `Pending` answer has no `irsCode` and carries `retryId` and `message`.
     * Rejects with an AxiosError on any answer other than 200; its `response.data` is an `ITINErrorResponseBody`.
     */
    public async verifyTIN(tin: string, businessName: string): Promise<ITINResponseBody> {
        const url = `${TIN_VERIFICATION_URL}?tin=${encodeURIComponent(tin)}&businessName=${encodeURIComponent(businessName)}`;

        const axiosResponse = await axios.get<ITINResponseBody>(url, {
            headers: {
                'x-api-key': this.apiKey
            }
        });

        return axiosResponse.data;
    }

    /**
     * Asks again for the result of a `Pending` check, by the `retryId` that check returned. A retry is not billed.
     * It answers an API key of the account that made the check, for 30 days after the check.
     * Resolves with the answer, which can be `Pending` again.
     * Rejects with an AxiosError on any answer other than 200; its `response.data` is an `ITINErrorResponseBody`.
     * The status is 404 when no `Pending` check of this account in the last 30 days returned that `retryId`,
     * and 400 when the `retryId` is not in the form a `Pending` answer gives.
     */
    public async retryTINVerification(retryId: string): Promise<ITINResponseBody> {
        const url = `${TIN_VERIFICATION_URL}?retryId=${encodeURIComponent(retryId)}`;

        const axiosResponse = await axios.get<ITINResponseBody>(url, {
            headers: {
                'x-api-key': this.apiKey
            }
        });

        return axiosResponse.data;
    }
}
