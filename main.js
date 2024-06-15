const express = require('express')
const app = express()
const port = 3000
const {connectDB} = require("./model/DbConnect")
const dotenv = require('dotenv')
const {verifyToken} = require("./Helpers/Helper")
const { Readable } = require('stream');
const fs = require('fs');
const path = require('path');
dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    // try {
    //     console.log(`${req.method} ${req.url}`);
    //     if(req.url != '/user/login' && req.url != '/user/register' && req.url != '/mainBucket'){
    //         console.log("Middle Ware Called");
    //         auth_token = req.headers.auth_key
    //         auth_details = verifyToken(auth_token)
    //         isValidToken = auth_details.is_valid_client ?? false
    //         if(isValidToken){
    //             next()
    //         }else{
    //             res.send("Not valid token")
    //         }
    //     }else{
    //         next()
    //     }
    // } catch (error) {
    //     res.send("Not valid token")
    // }
    next()
});

app.use("/", require('./router/home'))
app.use("/bucket", require('./router/bucket'))
app.use("/object",require('./router/file_object'))
app.use("/serve",require('./router/serve'))

app.listen(port, () => {
    connectDB()
    console.log(`Example app listening on port ${port}`)
})