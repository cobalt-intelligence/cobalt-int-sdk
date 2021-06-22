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
    // Test alternatives
    // await getDetails('STOKESBERRY TRUCKING LLC', 'missouri');

})();

async function getDetails(businessName: string, state: string) {
    const sosApi = new SosApi(process.env.cobaltIntApiKey);

    const details = await sosApi.getBusinessDetails(businessName, state);

    console.log('details', details);
}