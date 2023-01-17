const { request, response } = require("express")


const uploadImage = (req = request, res = response) => {
    const { image } = req.body;

    console.log(req.body)    
    console.log(req.params)    
    console.log(req.query)    

    if (!image) {
        return res.status(400).json({
            msg: 'No image found'
        });
    }

    res.status(201).json({
        msg: 'PUT upload image',
        image
    });
}

const analizaImage = (req = request, res = response) => {

}


module.exports = {
    uploadImage,
    analizaImage
}