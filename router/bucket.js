const express = require('express')
const router = express.Router()

const {home_res} = require('../controller/home')

router.route("/").get(home_res)

module.exports = router;