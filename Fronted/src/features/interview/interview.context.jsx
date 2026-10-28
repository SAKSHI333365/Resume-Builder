import { Children, createContext ,useState} from "react";
import "../style/home.scss"
import { useInterview } from "../hooks/useinterview";
import { useNavigate } from "react-router";

const Home=()=>{
    const {loading,generateReport}=useInterview()
    const [jobDescription,setJobDescription]=useState("")
    const [selfDescription,setSelfDescription]=useState("")
    const resumeInputRef=useRef()

    const handleGenerateReport=async()=>{
        const resumeFile=resumeInputRef.current.files[0]
        await generateReport({jobDescription,selfDescription,resumeFile})
    }
}
export const InterviewContext=createContext()

export const InterviewProvider=({Children})=>{

    const [loading,setLoading]=useState(false)
    const[report,setReport]=useState(null)
    const[reports,setReports]=useState([])


    return (
        <InterviewContext.Provider value={{loading,setLoading,report,setReport,reports,setReports}}>
            {Children}
        </InterviewContext.Provider>
    )
}