import { SosApi } from ".";
import dotenv from 'dotenv';
import { DelinquentTaxApi } from "./delinquentTaxApi";
import { CountyAssessorApi } from "./countyAssessorApi";

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
    // await getDetailsBySosId('20151458554', 'colorado');

    // sosId with Delaware
    // await getDetailsBySosId('2011864', 'delaware');

    // Delinquent Taxes
    // await getDelinquentTaxes();

    // test searchAllStatesByBusinessName
    // await searchAllStates();
    
    // Get by name
    // await getDetails("mighty", 'md', false);

    await getDetailsBySosId('70674247', 'pennsylvania', false);

    // await getDetailsByPersonName('Peter', '', 'alaska', true, false, false, null, null, null);

    // await getListBySearchQuery('pizza tax sean', 'wy', true);


})();

async function getDetails(businessName: string, state: string, liveData?: boolean, screenshot?: boolean, uccData?: boolean, street?: string, city?: string, zip?: string) {
    const sosApi = new SosApi(process.env.cobaltIntApiKey, 'dev');
    // const sosApi = new SosApi(process.env.jacobAPIKey, 'dev');
    const details = await sosApi.getBusinessDetails(businessName, state, liveData, screenshot, uccData, street, city, zip);

    console.log('details', details, details?.results?.[0]?.uccData, details?.results?.[0]?.messages, details?.results?.[0]?.documents);
}

async function getDetailsBySosId(sosId: string, state: string, liveData?: boolean, screenshot?: boolean, uccData?: boolean, street?: string, city?: string, zip?: string) {
    const sosApi = new SosApi(process.env.cobaltIntApiKey, 'dev');

    const details = await sosApi.getBusinessDetailsBySosId(sosId, state, liveData, screenshot, uccData, street, city, zip);

    console.log('details', details);
}

async function getDetailsByPersonName(firstName: string, lastName: string, state: string, liveData?: boolean, screenshot?: boolean, uccData?: boolean, street?: string, city?: string, zip?: string) {
    const sosApi = new SosApi(process.env.cobaltIntApiKey, 'dev');

    const details = await sosApi.getDetailsByPersonName(firstName, lastName, state, liveData, screenshot, uccData, street, city, zip);

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