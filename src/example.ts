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
    await getDetails('tax & accounting', 'nj', true, null, null, null, 'hightstown', null);

    // await getDetailsBySosId('937294', 'oh', true, true, true);

})();

async function getDetails(businessName: string, state: string, liveData?: boolean, screenshot?: boolean, uccData?: boolean, street?: string, city?: string, zip?: string) {
    const sosApi = new SosApi(process.env.cobaltIntApiKey, 'dev');

    const details = await sosApi.getBusinessDetails(businessName, state, liveData, screenshot, uccData, street, city, zip);

    console.log('details', details, details?.results?.[0]?.uccData);
}

async function getDetailsBySosId(sosId: string, state: string, liveData?: boolean, screenshot?: boolean, uccData?: boolean, street?: string, city?: string, zip?: string) {
    const sosApi = new SosApi(process.env.cobaltIntApiKey, 'dev');

    const details = await sosApi.getBusinessDetailsBySosId(sosId, state, liveData, screenshot, uccData, street, city, zip);

    console.log('details', details);
}

async function getDelinquentTaxes() {
    const delinquentTaxApi = new DelinquentTaxApi(process.env.cobaltIntApiKey);

    const response = await delinquentTaxApi.getDelinquentTaxes({ greaterThan: 500, delinquentYears: [2018] });

    console.log('Records', response.totalRecords, response.records[0], response.records[25]);
}

async function searchAllStates() {
    const sosApi = new SosApi(process.env.cobaltIntApiKey);

    const results = await sosApi.searchAllStatesByBusinessName('pizza hut llc');

    console.log('Results', results);

}

async function getParcelInformation(parcelNumber: string, county: string, state: string) {
    const countyAssessorApi = new CountyAssessorApi(process.env.cobaltIntApiKey);

    const parcel = await countyAssessorApi.getParcelInformation(parcelNumber, county, state);

    console.log('parcel', parcel);
}