const express = require('express')
const router = express.Router()

const {register_user, login_user} = require('../controller/home')

router.route("/user/register").post(register_user)
router.route("/user/login").post(login_user)

module.exports = router;