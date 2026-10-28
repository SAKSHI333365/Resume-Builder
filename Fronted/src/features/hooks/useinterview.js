import {getAllInterviewReports,generateInterviewReport,getInterviewReportById} from "../services/interview"

import { useContext } from "react"
import { InterviewContext } from "../interview/interview.context"

export const useInterview=()=>{

    const context=useContext(InterviewContext)

    if(!context){
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const {loading,setLoading,report,setReport,reports,setReports}=context

    const generateReport=async ({jobDescription,selfDescription,resumeFile})=>{
        setLoading(true)
        try{
            const response=await generateInterviewReport({jobDescription,selfDescription})
            setReport(response.interviewReport)
        }catch(error){
           console.error("Error generating interview report",error)
        }finally{
            setLoading(false)
        }
    }
        
    const getReportbyId=async(interviewId)=>{

    }

    const getReports=async()=>{

    }

    return {loading,report,reports,generateReport,getReportbyId,getReports}
    
}