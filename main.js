const express = require('express')
const app = express()
const port = 3000
const {connectDB} = require("./model/DbConnect")
const dotenv = require('dotenv')
dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    // console.log(`${req.method} ${req.url}`);
    console.log("Middle Ware Called");
    // console.log(req.headers)
    next();
    // res.send("Not valid token")
});

app.use("/", require('./router/home'))
app.use("/bucket", require('./router/bucket'))
app.use("/object",require('./router/file_object'))

app.listen(port, () => {
    connectDB()
    console.log(`Example app listening on port ${port}`)
})