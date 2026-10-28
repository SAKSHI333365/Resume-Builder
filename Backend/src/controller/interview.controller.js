const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

async function generateInterviewReportController(req, res) {
    try {
        const resumeFile = req.file
        const { selfDescription = "", jobDescription } = req.body
        if (!resumeFile) {
            return res.status(400).json({ error: "A PDF resume is required." })
        }
        if (!jobDescription?.trim()) {
            return res.status(400).json({ error: "A job description is required." })
        }

        const pdfData = await pdfParse(resumeFile.buffer)
        const resumeContent = pdfData.text
        if (!resumeContent.trim()) {
            return res.status(400).json({ error: "No readable text was found in the uploaded PDF." })
        }

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent,
            selfDescription,
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent,
            selfDescription,
            jobDescription,
            ...interviewReportByAi,
        })

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        })
    } catch (error) {
        console.error("Interview report generation failed:", error)
        res.status(500).json({ error: error.message })
    }
}

module.exports = { generateInterviewReportController }