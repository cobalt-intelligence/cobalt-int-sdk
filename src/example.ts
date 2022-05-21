import { SosApi } from ".";
import dotenv from 'dotenv';
import { DelinquentTaxApi } from "./delinquentTaxApi";
import { IParcel } from "cobalt-int-common";
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
    // await getDetails('tax & accounting', 'nj', true, null, null, null, 'hightstown', null);

    // await getDetailsBySosId('937294', 'oh', true, true, true);

    await getListBySearchQuery('pizza', 'wy', true);

})();

async function getDetails(businessName: string, state: string, liveData?: boolean, screenshot?: boolean, uccData?: boolean, street?: string, city?: string, zip?: string) {
    const sosApi = new SosApi(process.env.cobaltIntApiKey);

    const details = await sosApi.getBusinessDetails(businessName, state, liveData, screenshot, uccData, street, city, zip);

    console.log('details', details, details?.results?.[0]?.uccData);
}

async function getDetailsBySosId(sosId: string, state: string, liveData?: boolean, screenshot?: boolean, uccData?: boolean, street?: string, city?: string, zip?: string) {
    const sosApi = new SosApi(process.env.cobaltIntApiKey);

    const details = await sosApi.getBusinessDetailsBySosId(sosId, state, liveData, screenshot, uccData, street, city, zip);

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