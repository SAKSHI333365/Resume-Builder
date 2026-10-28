require('dotenv').config();
const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = z.object({
  matchScore: z.number().min(0).max(100).describe("How closely the candidate's experience matches the role"),
  technicalQuestions: z.array(z.object({
    question: z.string().describe("A role-specific technical interview question"),
    intention: z.string().describe("What the interviewer is evaluating and what the answer should cover"),
    answer: z.string().describe("A concise example answer grounded in the candidate's resume"),
  })).describe("Technical interview questions and answer guidance"),
  behavioralQuestions: z.array(z.object({
    question: z.string().describe("A role-specific behavioral interview question"),
    intention: z.string().describe("What the interviewer is evaluating and what the answer should cover"),
    answer: z.string().describe("A concise example answer grounded in the candidate's resume"),
  })).describe("Behavioral interview questions and answer guidance"),
  skillGaps: z.array(z.object({
    skill: z.string().describe("A relevant skill or experience gap for the target role"),
    severity: z.enum(["low", "medium", "high"]).describe("The priority of addressing this skill gap")
  })).describe("Skills to improve for the target role"),
  preparationPlan: z.array(z.object({
    day: z.number().int().positive().describe("The numbered preparation day"),
    focus: z.string().describe("The main focus for the day"),
    tasks: z.array(z.string()).describe("Practical preparation tasks for the day")
  })).describe("A short, actionable interview preparation plan")
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  const prompt = `Generate an interview report for a candidate with the following details:
Resume:
${resume}

Candidate description:
${selfDescription || "Not provided"}

Job description:
${jobDescription}

Base every assessment and example answer only on the provided information. Do not invent candidate experience. Keep questions and preparation tasks specific to the role.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(interviewReportSchema)
    }
  });

  return interviewReportSchema.parse(JSON.parse(response.text));
}

module.exports = generateInterviewReport;