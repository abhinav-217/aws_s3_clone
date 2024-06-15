const express = require('express')
const app = express()
const port = 3000
const {connectDB} = require("./model/DbConnect")
const dotenv = require('dotenv')
const {verifyToken} = require("./Helpers/Helper")
dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    try {
        console.log(`${req.method} ${req.url}`);
        if(req.url.includes('register') || req.url.includes('login') || req.url.includes('serve/file')){
            next();
        }else{
            auth_token = req.headers.auth_key
            auth_details = verifyToken(auth_token)
            isValidToken = auth_details.is_valid_client ?? false
            if(isValidToken){
                next()
            }else{
                res.status(400).json({status:false,message:"Not valid token"})
            }
        }
    } catch (error) {
        res.send("Not valid token")
    }
});

app.use("/", require('./router/home'))
app.use("/bucket", require('./router/bucket'))
app.use("/object",require('./router/file_object'))
app.use("/serve",require('./router/serve'))


app.get("/video",(req,res)=>{
    
})

app.listen(port, () => {
    connectDB()
    console.log(`Example app listening on port ${port}`)
})