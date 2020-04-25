const azureStorage = require('azure-storage');

module.exports = async function (context, req) {


    const userId = req.headers['x-ms-client-principal-id'];
    if ( (req.body && req.body.bathersPreference)) {

        const connString = process.env.AzureWebJobsStorage;

        const tableService = azureStorage.createTableService(connString);
        const entGen = azureStorage.TableUtilities.entityGenerator;

        const entity = {
            PartitionKey: entGen.String(userId),
            RowKey: entGen.String(userId),
            bathers: entGen.String(req.body.bathersPreference)

        }

        await new Promise((resolve, reject) =>{
            tableService.insertOrReplaceEntity(process.env.table_name, entity, (error, result, response) => {
                if(error){
                    reject(error);             
                }
                else{
                    resolve({result, response})
                }
            })
        });




        context.res = {
            // status: 200, /* Defaults to 200 */
            body: JSON.stringify({
                result: true
            })
        };
    }
    else {
        context.res = {
            body: JSON.stringify({
                result: false
            })
        };
    }
};