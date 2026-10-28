const express=require("express")
const authMiddleware=require("../middlewares/auth.middleware")
const interviewController=require("../controller/interview.controller")
const upload=require("../middlewares/file.middleware")

const interviewRouter=express.Router()

interviewRouter.post("/",authMiddleware.authUser,upload.single("resume"),interviewController.generateInterviewReportController)

module.exports=interviewRouter