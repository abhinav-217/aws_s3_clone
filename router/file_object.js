const express = require('express')
const router = express.Router()

const {home_res} = require('../controller/file_object')

router.route("/").get(home_res)

module.exports = router;