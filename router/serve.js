const express = require('express')
const router = express.Router()

const {serve_file, stream_file } = require('../controller/serve')

router.route("/file").get(serve_file)
router.route("/stream").post(stream_file)

module.exports = router;