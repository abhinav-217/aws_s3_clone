const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientBucketSchema = new Schema({
    bucket_name: {
        type: String,
        unique: true,
        require:true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
}, {
    timestamps: true
});

const ClientBucket = mongoose.model('Client_Bucket', ClientBucketSchema);
module.exports = ClientBucket;
