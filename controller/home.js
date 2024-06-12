async function home_res(req,res){
    console.log(__dirname)
    res.json({status:true})
}

module.exports = {home_res}