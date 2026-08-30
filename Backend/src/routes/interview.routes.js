const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middlwware");

const interviewRouter = express.Router()

/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of the user self description, resume pdf and job description.
 * @access private
 */

interviewRouter.post("/", authMiddleware.authUser,upload.single("resume"), interviewController.generateInterViewReportController)

/**
 * @route get/api/interview/report/:interviewId
 * @description get interview report by interviewId
 * @access private
 */

interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController);

/**
 * @route get/api/interview/
 * @description get all interview reports of logged in user.
 * @access privtae
 */

interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportController);

/**
 * @route get/api/interview/resume/pdf
 * @description generate resume pdf on the user self description, resume content and job descripiton
 * @access private
 */

interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)
module.exports = interviewRouter;