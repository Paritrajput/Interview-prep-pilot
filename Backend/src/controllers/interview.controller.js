const pdfParse = require("pdf-parse");
const {generateInterviewReport, generateResumePdf} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description controller to generate interview report based on user self description, resume and job description
 */
async function generateInterViewReportController(req, res){
    try {
        const resumeFile = req.file;
        const { selfDescription, jobDescription } = req.body;

        let resumeContentText = '';
        if (resumeFile && resumeFile.buffer) {
            // pdf-parse exposes a function that accepts a Buffer and returns parsed data
            const parsed = await pdfParse(resumeFile.buffer);
            resumeContentText = parsed && parsed.text ? parsed.text : '';
        } else {
            // If no resume uploaded, use selfDescription as fallback for AI input
            resumeContentText = selfDescription || '';
        }

        // 1. Get the raw response from the AI
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContentText,
            selfDescription,
            jobDescription
        });

        // =====================================================================
        // 2. SANITIZE THE DATA HERE (Before saving to MongoDB)
        // =====================================================================
        if (interViewReportByAi.skillGaps && Array.isArray(interViewReportByAi.skillGaps)) {
            interViewReportByAi.skillGaps = interViewReportByAi.skillGaps.map(gap => ({
                ...gap,
                severity: gap.severity ? gap.severity.toLowerCase() : 'low'
            }));
        }
        // =====================================================================

        // 3. Save the sanitized data to the database
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContentText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        });

        // 4. Send the response
        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        });
    } catch (error) {
        console.error('Interview report generation failed:', error);
        // Use status from the error when available (e.g., AI SDK may set 429/503)
        const statusCode = error && error.status ? error.status : 503
        res.status(statusCode).json({
            message: error.message || 'Interview service unavailable. Please try again later.',
            error: error && error.stack ? error.stack : undefined
        });
    }
}


/**
 * @description controller to get interview report by interviewId.
 */

async function getInterviewReportByIdController(req, res) {
    const {interviewId} = req.params
    const interviewReport = await interviewReportModel.findOne({_id:interviewId, user:req.user.id})

    if(!interviewReport){
        return res.status(404).json({
            message:"Interview report not found."
        })
    }

    res.status(200).json({
        message:"Interview report fetched successfully.",
        interviewReport
    })
}

/**
 * @description controller to get all interview reports of logged in user.
 */

async function getAllInterviewReportController(req, res) {
    const interviewReports = await interviewReportModel
        .find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

    res.status(200).json({
        message:"Interview reports fetched successfully.",
        interviewReports
    });
}

async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportController, generateResumePdfController };