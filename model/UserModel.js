const UserSchema = require("../Schemas/User");
const {generateToken,verifyToken} = require("../Helpers/Helper")

async function register_client(user_name, email, password) {
    let err = "";
    let saved_user = null;
    let is_success = true;
    try {
        const check_existing_user = await UserSchema.findOne({ email });
        console.log(check_existing_user)
        if (!check_existing_user) {
            let token = null
            const new_user = new UserSchema({
                user_name,
                email,
                password,
                token
            })
            saved_user = await new_user.save();
        } else {
            throw new Error(
                "An account with same email already exists. Try logging in!!"
            );
        }
    } catch (error) {
        is_success = false;
        err = error.message
    } finally {
        let resp_obj = {
            status: is_success,
        };
        if (!is_success) resp_obj.err = err;
        if (is_success) resp_obj.data = saved_user;
        return resp_obj;
    }
}

async function login_client(email,password){
    let token = null
    let err = "";
    let is_success = true;
    try {
        const get_user = await UserSchema.find({ email });
        if(get_user.length){
            if(get_user[0].password == password){
                let _id = get_user[0]._id.toString()
                const payload = {
                    _id, 
                    email
                };
                token = generateToken(payload);
                const result = await UserSchema.updateOne(
                    { email: email }, 
                    { $set: { token } }
                );
                if(!result.modifiedCount) throw new Error("Unable to update token")
            }else{
                throw new Error("Passoword does not match");
            }
        }else{
            throw new Error("email not found");
        }
    } catch (error) {
        err = error.message;
        is_success = false;
    } finally{
        let resp_obj = {
            status: is_success,
        };
        if (!is_success) resp_obj.err = err;
        if (is_success) resp_obj.token = token;
        return resp_obj;
    }
}

module.exports = { register_client, login_client };
