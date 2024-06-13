const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const url = process.env.MONGO_URL;
        const conn = await mongoose.connect(url, {
        });
        console.log("Db Connected Successfully");
    } catch (error) {
        console.error("DB Error:", error);
    }
};

module.exports = { connectDB };
