const axios = require('axios');

const azureAnalyzeImage = async (bodyRequest) => {

    const { image, description, objects } = bodyRequest;
    let urlRequest = `${process.env.AZURE_CS_ENDPOINT}/vision/v3.2/analyze?visualFeatures=Categories,`;

    description ? urlRequest += 'Description,' : null;
    objects ? urlRequest += 'Objects,' : null;
    urlRequest += '&model-version=latest&language=en';

    const body = { "url": image };

    const response = await axios.post(urlRequest, body, {
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.AZURE_CS_KEY
        }
    }).then((response) => {
        return {
            ok: true,
            data: response.data
        }
    }).catch((error) => {
        return { ok: false };
    });

    return response;

}

module.exports = {
    azureAnalyzeImage
}