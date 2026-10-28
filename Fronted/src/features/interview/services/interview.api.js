import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:3000`,
  withCredentials: true,
})

export async function createInterviewReport({ resume, jobDescription, selfDescription }) {
  const formData = new FormData()
  formData.append("resume", resume)
  formData.append("jobDescription", jobDescription)
  formData.append("selfDescription", selfDescription)

  const response = await api.post("/api/interview", formData)
  return response.data
}
