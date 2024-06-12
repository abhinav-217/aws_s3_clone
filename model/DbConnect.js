const { default: mongoose } = require("mongoose")

const connectDB = async ()=>{
    try {
        const url = process.env.MONGO_URL;
        const conn = await mongoose.connect(url, {
            useNewUrlParser: true,
          })
        let check = false;
        for (const prop in conn) {
            if (conn.hasOwnProperty(prop)) {
                if(prop=="connections")
                {
                    check = true;
                    console.log("Db Connected SuccessFully");
                    break;
                }
            }
        }
        if(check==false){
            console.log("Custom Error Says:- ")
            console.log("DB Not Connected You might need to Add your IP Address In atlas")
        }
    } catch (error) {
        console.log("DB Error:- ",error)
    }
}

module.exports = connectDB;