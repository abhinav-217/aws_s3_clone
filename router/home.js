const express = require('express')
const router = express.Router()

const {register_user, login_user, generate_key} = require('../controller/home')

router.route("/user/register").post(register_user)
router.route("/user/login").post(login_user)
router.route("/user/generate_access_token").post(generate_key)

module.exports = router;