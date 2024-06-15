const UserSchema = require("../Schemas/User");
const {generateToken,verifyToken} = require("../Helpers/Helper");
const ClientBucket = require("../Schemas/Bucket_Schema");

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
    }
    let resp_obj = {
        status: is_success,
    };
    if (!is_success) resp_obj.err = err;
    if (is_success) resp_obj.data = saved_user;
    return resp_obj;
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
                let is_valid_client = true
                const payload = {
                    _id, 
                    email,
                    is_valid_client
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
    }
    let resp_obj = {
        status: is_success,
    };
    if (!is_success) resp_obj.err = err;
    if (is_success) resp_obj.token = token;
    return resp_obj;
    
}

async function update_bucket_access_token(new_access_token,user_id){
    try {
        const result = await ClientBucket.updateMany(
            {
              user_id: user_id
            },
            {
              $set: {
                access_token: new_access_token
              }
            }
        );
        if(result.modifiedCount == 0) 
            throw new Error("Unable to update token"+JSON.stringify(result))
        return true
    } catch (error) {
        console.log(error)
        return false;
    }
}
async function replace_new_token(old_access_token,access_token){
    try {
        const upd = await UserSchema.updateOne(
            {
                access_token:old_access_token
            },
            {
                $set:{
                    access_token:access_token
                }
            }
        )
        return upd;
    } catch (error) {
        console.log(error.message)
        return {modifiedCount:0}
    }
}

async function update_access_token(access_token,email,_id){
    let is_success = true
    try {
        const user_details = await UserSchema.findOne({_id})
        let old_access_token = user_details.access_token

        const result = await UserSchema.updateOne(
            { email: email }, 
            { $set: { access_token } }
        );
        
        if(result.modifiedCount == 0) 
            throw new Error("Unable to update token"+JSON.stringify(result))

        const bucket_update = await update_bucket_access_token(access_token,_id)

        if(!bucket_update)
            is_success = false

        if(!is_success){
            const replace_access_token = await replace_new_token(old_access_token,access_token)
            if(replace_access_token.modifiedCount == 0) 
                throw new Error("Unable to update token"+JSON.stringify(result))
            return false
        }
        return true
    } catch (error) {
        console.log(error)
        return false;
    }
}

module.exports = { register_client, login_client, update_access_token };
