const multer = require('multer');

const MIME_TYPES = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg'
};

const maxSize = 500; //kb

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let error = new Error("mime type or size invalid");
        let isValid = MIME_TYPES[file.mimetype];
        if (isValid) {
            error = null;
        }
        cb(error, "backend/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(".")[0].split(' ').join('-');
        const ext = MIME_TYPES[file.mimetype];
        cb(null, name+('-')+Date.now()+('.')+ext);
    }
});

module.exports = storage;

