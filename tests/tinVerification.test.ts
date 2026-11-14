import { after, before, beforeEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import axios, { AxiosAdapter, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ITINErrorResponseBody, ITINResponseBody, TINVerification, TINVerificationStatus } from '../src';
import {
    completeAnswer,
    didNotMatchAnswer,
    irsTimeoutAnswer,
    pendingAnswer,
    pendingRetryId,
    retryFinalAnswer,
    retryInvalidAnswer,
    retryNotFoundAnswer,
    retryStillPendingAnswer,
    tinMatchedAnswer
} from './fixtures/tinVerificationAnswers';

const inventedApiKey = 'invented-test-api-key';
const tinVerificationUrl = 'https://apigateway.cobaltintelligence.com/tinVerification';

const sentRequests: InternalAxiosRequestConfig[] = [];
let nextAnswer: { status: number; body: ITINResponseBody | ITINErrorResponseBody } | undefined;
let originalAdapter: typeof axios.defaults.adapter;

/**
 * Stands in for the network for every axios request in this file. Records the request and answers with the
 * canned answer as JSON text; an answer other than 2xx rejects with an AxiosError, the way axios does.
 */
const fakeNetworkAdapter: AxiosAdapter = async (requestConfig) => {
    sentRequests.push(requestConfig);
    if (!nextAnswer) {
        throw new Error(`No canned answer for ${requestConfig.url}`);
    }
    const response: AxiosResponse = {
        data: JSON.stringify(nextAnswer.body),
        status: nextAnswer.status,
        statusText: '',
        headers: { 'content-type': 'application/json' },
        config: requestConfig
    };
    if (nextAnswer.status >= 200 && nextAnswer.status < 300) {
        return response;
    }
    throw new AxiosError(`Request failed with status code ${nextAnswer.status}`, AxiosError.ERR_BAD_REQUEST, requestConfig, undefined, response);
};

/**
 * Makes the fake network answer the next request with this status and body.
 */
function answerWith(status: number, body: ITINResponseBody | ITINErrorResponseBody): void {
    nextAnswer = { status, body };
}

/**
 * Returns a check for assert.rejects: the error is an AxiosError with this status and this body.
 */
function axiosErrorWith(status: number, body: ITINErrorResponseBody): (error: unknown) => boolean {
    return (error: unknown) => {
        assert.ok(axios.isAxiosError<ITINErrorResponseBody>(error), 'expected an AxiosError');
        assert.equal(error.response?.status, status);
        assert.deepEqual(error.response?.data, body);
        return true;
    };
}

before(() => {
    originalAdapter = axios.defaults.adapter;
    axios.defaults.adapter = fakeNetworkAdapter;
});

after(() => {
    axios.defaults.adapter = originalAdapter;
});

beforeEach(() => {
    sentRequests.length = 0;
    nextAnswer = undefined;
});

describe('verifyTIN', () => {
    const answersByStatus: [TINVerificationStatus, ITINResponseBody][] = [
        ['TIN Matched', tinMatchedAnswer],
        ['Did Not Match', didNotMatchAnswer],
        ['Complete', completeAnswer],
        ['Pending', pendingAnswer]
    ];

    for (const [status, answer] of answersByStatus) {
        test(`resolves with the ${status} answer`, async () => {
            answerWith(200, answer);

            const result = await new TINVerification(inventedApiKey).verifyTIN(answer.tin, answer.name);

            assert.equal(result.status, status);
            assert.deepEqual(result, answer);
        });
    }

    test('sends the TIN and the business name in the query string, with the API key', async () => {
        answerWith(200, didNotMatchAnswer);

        await new TINVerification(inventedApiKey).verifyTIN('000736218', 'Sample Ridge Bakery, LLC');

        assert.equal(sentRequests.length, 1);
        assert.equal(sentRequests[0].method, 'get');
        assert.equal(sentRequests[0].url, `${tinVerificationUrl}?tin=000736218&businessName=Sample%20Ridge%20Bakery%2C%20LLC`);
        assert.equal(sentRequests[0].headers.get('x-api-key'), inventedApiKey);
    });

    test('a Pending answer has no irsCode and carries retryId and the retry message', async () => {
        answerWith(200, pendingAnswer);

        const result = await new TINVerification(inventedApiKey).verifyTIN('000468139', 'Demo Meadow Holdings LLC');

        assert.equal('irsCode' in result, false);
        assert.equal(result.retryId, pendingRetryId);
        assert.ok(result.message.includes(`${tinVerificationUrl}?retryId=${pendingRetryId}`));
    });

    test('a completed answer has an irsCode and no retryId', async () => {
        answerWith(200, tinMatchedAnswer);

        const result = await new TINVerification(inventedApiKey).verifyTIN('000294581', 'Example Harbor Supply Co.');

        assert.equal(result.irsCode, 7);
        assert.equal('retryId' in result, false);
    });

    test('rejects with the 500 answer when the IRS times out', async () => {
        answerWith(500, irsTimeoutAnswer);

        await assert.rejects(
            new TINVerification(inventedApiKey).verifyTIN('000851246', 'Example Lantern Works LLC'),
            axiosErrorWith(500, irsTimeoutAnswer)
        );
    });
});

describe('retryTINVerification', () => {
    test('asks for the result by retryId, with the API key', async () => {
        answerWith(200, retryFinalAnswer);

        await new TINVerification(inventedApiKey).retryTINVerification(pendingRetryId);

        assert.equal(sentRequests.length, 1);
        assert.equal(sentRequests[0].method, 'get');
        assert.equal(sentRequests[0].url, `${tinVerificationUrl}?retryId=${pendingRetryId}`);
        assert.equal(sentRequests[0].headers.get('x-api-key'), inventedApiKey);
    });

    test('encodes the retryId, so it cannot add a TIN to the query string', async () => {
        answerWith(400, retryInvalidAnswer);

        await assert.rejects(
            new TINVerification(inventedApiKey).retryTINVerification('not an id&tin=000294581'),
            axiosErrorWith(400, retryInvalidAnswer)
        );

        assert.equal(sentRequests[0].url, `${tinVerificationUrl}?retryId=not%20an%20id%26tin%3D000294581`);
    });

    test('resolves with the final result, which carries the masked TIN', async () => {
        answerWith(200, retryFinalAnswer);

        const result = await new TINVerification(inventedApiKey).retryTINVerification(pendingRetryId);

        assert.deepEqual(result, retryFinalAnswer);
        assert.equal(result.tin, 'XXXXX8139');
    });

    test('resolves with Pending again, with the same retryId and no irsCode', async () => {
        answerWith(200, retryStillPendingAnswer);

        const result = await new TINVerification(inventedApiKey).retryTINVerification(pendingRetryId);

        assert.deepEqual(result, retryStillPendingAnswer);
        assert.equal(result.status, 'Pending');
        assert.equal(result.retryId, pendingRetryId);
        assert.equal('irsCode' in result, false);
    });

    test('rejects with 404 when no Pending check of this account returned that retryId', async () => {
        answerWith(404, retryNotFoundAnswer);

        await assert.rejects(
            new TINVerification(inventedApiKey).retryTINVerification('Zr5Tn8Kc2Wm6Hq9Ld3Fx7Bv4'),
            axiosErrorWith(404, retryNotFoundAnswer)
        );
    });

    test('rejects with 400 when the retryId is not in the form a Pending answer gives', async () => {
        answerWith(400, retryInvalidAnswer);

        await assert.rejects(
            new TINVerification(inventedApiKey).retryTINVerification('not-a-retry-id'),
            axiosErrorWith(400, retryInvalidAnswer)
        );
    });
});

describe('TINVerificationStatus', () => {
    test('holds the four statuses prod returns and no other', () => {
        const everyStatus: TINVerificationStatus[] = ['TIN Matched', 'Did Not Match', 'Complete', 'Pending'];
        // @ts-expect-error In Review is not a status prod returns, so this line must not compile.
        const retiredStatus: TINVerificationStatus = 'In Review';

        assert.equal(new Set(everyStatus).size, 4);
        assert.equal(everyStatus.includes(retiredStatus), false);
    });
});
