import { ITINErrorResponseBody, ITINResponseBody } from '../../src';

// The TIN examples in cobalt-intelligence-postman-docs #14, read off the prod handler. Names and TINs are invented.

export const pendingRetryId = 'Qx7Lm2Np9Rt4Vw8Yz3Bc6Df1';

export const tinMatchedAnswer: ITINResponseBody = {
    name: 'Example Harbor Supply Co',
    tin: '000294581',
    status: 'TIN Matched',
    irsCode: 7,
    irsReason: 'TIN/Name combination matches EIN records',
    irsServiceStatus: '',
    lastIRSCheckDate: ''
};

export const didNotMatchAnswer: ITINResponseBody = {
    name: 'Sample Ridge Bakery LLC',
    tin: '000736218',
    status: 'Did Not Match',
    irsCode: 3,
    irsReason: 'TIN/Name combination does not match IRS records',
    irsServiceStatus: '',
    lastIRSCheckDate: ''
};

export const completeAnswer: ITINResponseBody = {
    name: 'Placeholder Freight Inc',
    tin: '000512347',
    status: 'Complete',
    irsCode: 4,
    irsReason: 'Invalid TIN Matching request',
    irsServiceStatus: '',
    lastIRSCheckDate: ''
};

export const pendingAnswer: ITINResponseBody = {
    name: 'Demo Meadow Holdings LLC',
    tin: '000468139',
    status: 'Pending',
    irsReason: "The IRS may be temporarily unavailable or you've exceeded the duplicate submission limit.",
    irsServiceStatus: '',
    lastIRSCheckDate: '',
    retryId: pendingRetryId,
    message: `The IRS has not returned a result yet. Retry later for free at https://apigateway.cobaltintelligence.com/tinVerification?retryId=${pendingRetryId} with the same x-api-key header. You won't be charged again.`
};

export const irsTimeoutAnswer: ITINErrorResponseBody = {
    message: "The IRS API is having troubles. Try again later, you haven't been charged"
};

export const retryFinalAnswer: ITINResponseBody = {
    name: 'Demo Meadow Holdings LLC',
    tin: 'XXXXX8139',
    status: 'TIN Matched',
    irsCode: 7,
    irsReason: 'TIN/Name combination matches EIN records',
    irsServiceStatus: '',
    lastIRSCheckDate: ''
};

export const retryStillPendingAnswer: ITINResponseBody = {
    ...pendingAnswer,
    tin: 'XXXXX8139'
};

export const retryNotFoundAnswer: ITINErrorResponseBody = {
    message: 'No pending TIN verification found for that retryId.'
};

export const retryInvalidAnswer: ITINErrorResponseBody = {
    message: 'Invalid retryId. Use the retryId from a Pending /tinVerification result.'
};
