async function generateInterviewReport(resume, selfDescription, jobDescription) {
  const prompt = `Generate an interview report for a candidate with the following details:
      Resume: ${resume}
      Self Description: ${selfDescription}
      Job Description: ${jobDescription}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(interviewReportSchema)
    }
  });

  return JSON.parse(response.text);
}