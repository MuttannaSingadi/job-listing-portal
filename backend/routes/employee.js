const router = require("express").Router()
const Employee = require("../models/Employee")

router.put("/profile", async(req,res)=>{

try{

const updated = await Employee.findOneAndUpdate(
{email:req.body.email},
req.body,
{new:true}
)

res.json(updated)

}catch(err){

res.status(500).json(err)

}

})

module.exports = router