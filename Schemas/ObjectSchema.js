const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectSchema = new Schema({
    filename: {
        type: String,
        required: true,
    },
    file_url: {
        type: String,
        required: true,
    },
    ext: {
        type: String,
        required: true,
    },
    bucket_name: {
        type: String,
        required: true,
    },
    user_id:{
        type:String,
        required:true
    },
    desc: {
        type: String,
    }
}, {
    timestamps: true
});


const ObjectModel = mongoose.model('Object', ObjectSchema);

module.exports = ObjectModel;
