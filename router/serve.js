const express = require('express')
const router = express.Router()

const {serve_file } = require('../controller/serve')

router.route("/file").get(serve_file)

module.exports = router;