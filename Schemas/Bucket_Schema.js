const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientBucketSchema = new Schema({
    bucket_name: {
        type: String,
        require:true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    is_public:{
        type:Boolean,
        default:false
    }
}, {
    timestamps: true
});

const ClientBucket = mongoose.model('Client_Bucket', ClientBucketSchema);
module.exports = ClientBucket;
