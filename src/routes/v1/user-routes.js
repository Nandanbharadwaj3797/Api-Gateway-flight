const express=require("express");
const router=express.Router();
const {UserController} = require("../../controllers");  

router.post("/signup", UserController.createUser);
router.post("/signin", UserController.signin);


module.exports=router;