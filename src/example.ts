import { SosApi } from ".";
import dotenv from 'dotenv';
import { IBusiness } from "./models";

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

    // Colorado
    // await getDetails('Amici Pizza & Pasta', 'colorado');

    // sosId with colorado
    // await getDetailsBySosId('20151458554', 'colorado');
    
    // sosId with california
    // await getDetailsBySosId('C0363631', 'california');

    // sosId with Delaware
    await getDetailsBySosId('2011864', 'delaware');

})();

async function getDetails(businessName: string, state: string) {
    const sosApi = new SosApi(process.env.cobaltIntApiKey);

    const details = await sosApi.getBusinessDetails(businessName, state);

    console.log('details', details);
}

async function getDetailsBySosId(businessName: string, state: string) {
    const sosApi = new SosApi(process.env.cobaltIntApiKey);

    const details = await sosApi.getBusinessDetailsBySosId(businessName, state);

    console.log('details', details);
}