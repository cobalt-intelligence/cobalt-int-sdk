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


    // await testBulk();

    testStream();
})();

async function getDetails(businessName: string, state: string) {
    const sosApi = new SosApi(process.env.cobaltIntApiKey);

    const details = await sosApi.getBusinessDetails(businessName, state);

    console.log('details', details);
}

async function testBulk() {
    const businesses: IBusiness[] = [
        {
            businessName: 'STOKESBERRY TRUCKING LLC',
            state: 'missouri'
        },
        {
            businessName: 'SUPERIOR BUILDING SERVICES, INC.',
            state: 'delaware'
        },
        {
            businessName: 'IRON GROUND TRUCKING LLC',
            state: 'texas'
        },
        {
            businessName: 'pizza',
            state: 'delaware'
        },
        {
            businessName: 'ROGERLINGS MOTORSPORTS LLC',
            state: 'georgia'
        }
    ];
    const sosApi = new SosApi(process.env.cobaltIntApiKey);
    const response = await sosApi.getBulkBusinessDetails(businesses);

    console.log('Response', response);

}

function testStream() {
    const sosApi = new SosApi(process.env.cobaltIntApiKey);

    const stream = sosApi.streamTest();


    stream.on('data', (data) => {
        console.log('Data', data);
    });

}