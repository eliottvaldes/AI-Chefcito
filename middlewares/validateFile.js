const { response } = require('express');


const validateFileToUpload = (req, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.fileUpload) {
        return res.status(400).json({
            msg: 'There are no files to upload'
        });
    }

    next();

}


module.exports = {
    validateFileToUpload
}
