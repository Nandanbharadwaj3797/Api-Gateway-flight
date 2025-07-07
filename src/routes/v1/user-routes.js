const express=require("express");
const router=express.Router();
const {UserController} = require("../../controllers");  
const {AuthRequestMiddlewares} = require("../../middlewares");
const { Auth } = require("../../utils/common");

router.post("/signup",AuthRequestMiddlewares.validateAuthRequest, UserController.createUser);
router.post("/signin",AuthRequestMiddlewares.validateAuthRequest, UserController.signin);


module.exports=router;