import { SosApi } from ".";
import dotenv from 'dotenv';
import { TINVerification } from ".";

dotenv.config();

(async () => {
    // Texas uses long polling
    // await getDetails('IRON GROUND TRUCKING LLC', 'texas');

    // Delaware uses long polling
    // await getDetails('SUPERIOR BUILDING SERVICES, INC.', 'delaware');

    // Delaware uses long polling
    // Test alternatives
    // await getDetails('pizza', 'delaware');

    // Missouri is normal
    // await getDetails('STOKESBERRY TRUCKING LLC', 'missouri');

    // sosId with colorado
    // await getDetailsBySosId('20151458554', 'colorado', true, false, false, null, null, null, null, '', false, false);

    // sosId with Delaware
    // await getDetailsBySosId('2011864', 'delaware');

    // Delinquent Taxes
    // await getDelinquentTaxes();

    // test searchAllStatesByBusinessName
    // await searchAllStates();
    
    // Get by name
    // await getDetails("DEERE & company", 'mo', true, true);

    // await getDetailsBySosId('70674247', 'pennsylvania', false);

    // await getDetailsByPersonName('Peter', '', 'alaska', true, false, false, null, null, null);

    // await getListBySearchQuery('pizza tax sean', 'wy', true);

    // Verify TIN
    // await verifyTIN('123456789', 'frank sanchez llc');

    // Ask again for a Pending TIN result, by the retryId it returned
    // await retryPendingTINVerification('<retryId from a Pending result>');


})();

/** Looks up a business by name and state, and logs the answer. */
async function getDetails(businessName: string, state: string, liveData?: boolean, screenshot?: boolean, uccData?: boolean, street?: string, city?: string, zip?: string, callbackUrl?: string, nameAvailabilityCheck?: boolean, findRelatedBusinesses?: boolean) {
    const sosApi = new SosApi(process.env.cobaltIntApiKey);
    const details = await sosApi.getBusinessDetails(businessName, state, liveData, screenshot, uccData, street, city, zip, callbackUrl, nameAvailabilityCheck, findRelatedBusinesses);

    console.log('details', details, details?.results?.[0]?.uccData, details?.results?.[0]?.messages, details?.results?.[0]?.documents);
}

/** Looks up a business by its Secretary of State id and state, and logs the answer. */
async function getDetailsBySosId(sosId: string, state: string, liveData?: boolean, screenshot?: boolean, uccData?: boolean, street?: string, city?: string, zip?: string, searchQuery?: string, callbackUrl?: string, nameAvailabilityCheck?: boolean, findRelatedBusinesses?: boolean) {
    const sosApi = new SosApi(process.env.cobaltIntApiKey);

    const details = await sosApi.getBusinessDetailsBySosId(sosId, state, liveData, screenshot, uccData, street, city, zip, searchQuery, callbackUrl, nameAvailabilityCheck, findRelatedBusinesses);

    console.log('details', details);
}

/** Looks up the businesses of a person by name and state, and logs the answer. */
async function getDetailsByPersonName(firstName: string, lastName: string, state: string, liveData?: boolean, screenshot?: boolean, uccData?: boolean, street?: string, city?: string, zip?: string, callbackUrl?: string, nameAvailabilityCheck?: boolean, findRelatedBusinesses?: boolean) {
    const sosApi = new SosApi(process.env.cobaltIntApiKey);

    const details = await sosApi.getDetailsByPersonName(firstName, lastName, state, liveData, screenshot, uccData, street, city, zip, callbackUrl, nameAvailabilityCheck, findRelatedBusinesses);

    console.log('details', details);
}

async function getListBySearchQuery(searchQuery: string, state: string, liveData?: boolean) {
    const sosApi = new SosApi(process.env.cobaltIntApiKey);

    const details = await sosApi.getListBySearchQuery(searchQuery, state, liveData);

    console.log('details', details);
}

async function searchAllStates() {
    const sosApi = new SosApi(process.env.cobaltIntApiKey);

    const results = await sosApi.searchAllStatesByBusinessName('pizza hut llc');

    console.log('Results', results);
}

async function verifyTIN(tin: string, businessName: string) {
    const tinVerification = new TINVerification(process.env.cobaltIntApiKey);

    const results = await tinVerification.verifyTIN(tin, businessName);

    console.log('Results', results);
}

/** Asks again for the result of a Pending TIN verification, by its retryId, and logs the answer. */
async function retryPendingTINVerification(retryId: string) {
    const tinVerification = new TINVerification(process.env.cobaltIntApiKey);

    const results = await tinVerification.retryTINVerification(retryId);

    console.log('Results', results);
}
