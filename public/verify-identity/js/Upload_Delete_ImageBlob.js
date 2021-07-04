module.exports = {
    uploadImg: async function uploadBlob(BlobServiceClient, fileName, uploadOptions, stream, containerName) {

        const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    
        try {
            await blockBlobClient.uploadStream(stream, uploadOptions.bufferSize, uploadOptions.maxBuffers, { blobHTTPHeaders: { blobContentType: "image/jpeg" } });
            console.log('File uploaded to Azure Storage!');
          } 
          catch (err) {
            console.log(err.message);
        }
    
    },
    
    getImgUrl: function getImgURL(storageAccountName, containerName, fileName) {
        return `https://${storageAccountName}.blob.core.windows.net/${containerName}/${fileName}`;
    }
}
