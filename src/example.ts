import { SosApi } from ".";
import dotenv from 'dotenv';
import { DelinquentTaxApi } from "./delinquentTaxApi";
import { IParcel } from "cobalt-int-common";

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
    // await getDetails('PRECISE SERVICES LLC', 'idaho');
    
    // Get by sosId
    await getDetailsBySosId('773409', 'idaho');

})();

async function getDetails(businessName: string, state: string) {
    const sosApi = new SosApi(process.env.cobaltIntApiKey);

    const details = await sosApi.getBusinessDetails(businessName, state);

    console.log('details', details);
}

async function getDetailsBySosId(sosId: string, state: string) {
    const sosApi = new SosApi(process.env.cobaltIntApiKey);

    const details = await sosApi.getBusinessDetailsBySosId(sosId, state);

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