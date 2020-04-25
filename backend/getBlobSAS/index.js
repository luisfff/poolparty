const azureStorage = require('azure-storage');

const returnError = (message) => {
    return {
        status: 500,
        headers: {
            'content-type': 'application/json'

        },
        body:JSON.stringify({
            error: message
        })
    }
}


const generateSasToken = async (container, blobName, permisions) => {
    const connString = process.env.AzureWebJobsStorage;
    const blobStorage = azureStorage.createBlobService(connString);

    const startDate = new Date();
    startDate.setMinutes(startDate.getMinutes() - 5);

    const expiryDate = new Date(startDate);
    expiryDate.setMinutes(startDate.getMinutes() + 60);

    const sharedAcessPolicy = {
        AccessPolicy: {
            Permissions: permisions,
            Start: startDate,
            Expiry: expiryDate
        }
    }

    const sasToken = blobStorage.generateSharedAccessSignature(container, blobName, sharedAcessPolicy);

    const exists = await new Promise((resolve, reject) => {
        blobStorage.doesBlobExist(container, blobName, (error, result) => {
            if(error){
                reject(error)
            } 
            else{
                resolve(result.exists)
            }
        })
    });

    const uri = blobStorage.getUrl(container, blobName, sasToken , true);

    return {
        token: sasToken,
        uri: uri,
        exists: exists
    }
}


module.exports = async function (context, req) {

    if(!(req.body && req.body.blobName)){
        context.res = returnError('No blobName in the body');
    }



    const blobName = req.body.blobName;
    const userId = req.headers['x-ms-client-principal-id']

    //read see write
    const permisions = 'rcw';
    const container = process.env.blobo_container_name;
    const sasToken = await generateSasToken(container, `${userId}/${blobName}`, permisions);

    context.res = {
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(sasToken)
    }

};