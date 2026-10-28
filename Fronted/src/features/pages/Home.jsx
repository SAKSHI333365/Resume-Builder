import { useState } from "react"
import { useAuth } from "../auth/hooks/useAuth"
import { createInterviewReport } from "../interview/services/interview.api"
import "../interview/style/interview.scss"

const Home = () => {
  const { user, error: authError, handleLogout } = useAuth()
  const [jobDescription, setJobDescription] = useState("")
  const [selfDescription, setSelfDescription] = useState("")
  const [resume, setResume] = useState(null)
  const [report, setReport] = useState(null)
  const [error, setError] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSignOut = async () => {
    try {
      await handleLogout()
    } catch {
      // The auth hook exposes the sign-out error in the header.
    }
  }

  const handleResumeChange = (event) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) {
      setResume(null)
      return
    }
    const isPdf = selectedFile.type === "application/pdf" || selectedFile.name.toLowerCase().endsWith(".pdf")
    if (!isPdf || selectedFile.size > 3 * 1024 * 1024) {
      setResume(null)
      setError(!isPdf ? "Please choose a PDF resume." : "Your resume must be 3 MB or smaller.")
      event.target.value = ""
      return
    }
    setError("")
    setResume(selectedFile)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setReport(null)
    if (!resume) {
      setError("Choose your resume PDF before generating a report.")
      return
    }

    setIsGenerating(true)
    try {
      const response = await createInterviewReport({ resume, jobDescription, selfDescription })
      setReport(response.interviewReport)
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "We couldn't generate your report. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="home">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Resume Studio home"><span className="brand-mark">R</span> resume studio</a>
        <div className="account-actions">
          {user?.username && <span className="welcome-user">Hi, {user.username}</span>}
          <button className="signout-button" type="button" onClick={handleSignOut}>Sign out</button>
        </div>
      </header>
      {authError && <p className="form-error auth-notice" role="alert">{authError}</p>}

      <section className="hero">
        <p className="eyebrow">YOUR NEXT INTERVIEW, WELL PREPARED</p>
        <h1>Turn your experience into <span>confidence.</span></h1>
        <p className="hero-copy">Share your resume and the role you want. Get tailored questions and a practical preparation plan.</p>
      </section>

      <section className="workspace">
        <form className="interview-form" onSubmit={handleSubmit}>
          <div className="section-heading">
            <span className="step-number">01</span>
            <div><h2>Tell us about the opportunity</h2><p>Give us the context to personalize your interview prep.</p></div>
          </div>
          <div className="form-grid">
            <div className="input-group job-field">
              <label htmlFor="jobDescription">Job description <span>Required</span></label>
              <textarea required id="jobDescription" name="jobDescription" value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="Paste the job description, including responsibilities and key requirements." />
            </div>
            <div className="input-group self-field">
              <label htmlFor="selfDescription">A little about you <span>Optional</span></label>
              <textarea id="selfDescription" name="selfDescription" value={selfDescription}
                onChange={(event) => setSelfDescription(event.target.value)}
                placeholder="What are you proud of? What kind of role are you looking for?" />
            </div>
          </div>

          <div className="section-heading resume-heading">
            <span className="step-number">02</span>
            <div><h2>Add your resume</h2><p>Upload a PDF so we can tailor questions to your experience.</p></div>
          </div>
          <label className={`resume-picker${resume ? " has-file" : ""}`} htmlFor="resume">
            <span className="upload-icon" aria-hidden="true">↑</span>
            <span className="upload-copy"><strong>{resume ? resume.name : "Choose a resume PDF"}</strong>
              <small>{resume ? "Click to choose a different file" : "PDF only · Up to 3 MB"}</small></span>
            <span className="browse-button">Browse files</span>
          </label>
          <input className="file-input" type="file" name="resume" id="resume" accept="application/pdf,.pdf"
            onChange={handleResumeChange} />

          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="generate-button" type="submit" disabled={isGenerating}>
            {isGenerating ? "Building your report..." : "Generate my interview report"} <span aria-hidden="true">→</span>
          </button>
          <p className="privacy-note">Your resume is used only to create this personalized report.</p>
        </form>
      </section>

      {report && <section className="report" aria-live="polite">
        <div className="report-heading">
          <div><p className="eyebrow">YOUR PERSONALIZED PREP</p><h2>Your interview report</h2></div>
          {Number.isFinite(report.matchScore) && <div className="match-score"><strong>{report.matchScore}</strong><span>role match</span></div>}
        </div>
        {!!report.skillGaps?.length && <section className="report-section">
          <h3>Skills to strengthen</h3>
          <div className="skill-list">{report.skillGaps.map((item, index) =>
            <article className={`skill-card severity-${item.severity}`} key={`${item.skill}-${index}`}>
              <strong>{item.skill}</strong><span>{item.severity} priority</span>
            </article>)}</div>
        </section>}
        {!!report.technicalQuestions?.length && <ReportQuestions title="Technical questions" items={report.technicalQuestions} />}
        {!!report.behavioralQuestions?.length && <ReportQuestions title="Behavioral questions" items={report.behavioralQuestions} />}
        {!!report.preparationPlan?.length && <section className="report-section">
          <h3>Your preparation plan</h3>
          <div className="plan-list">{report.preparationPlan.map((day) =>
            <article className="plan-card" key={day.day}><span>DAY {day.day}</span><h4>{day.focus}</h4>
              <ul>{day.tasks?.map((task) => <li key={task}>{task}</li>)}</ul></article>)}</div>
        </section>}
      </section>}
    </main>
  )
}

const ReportQuestions = ({ title, items }) => (
  <section className="report-section">
    <h3>{title}</h3>
    <div className="question-list">{items.map((item, index) =>
      <article className="question-card" key={`${item.question}-${index}`}>
        <span className="question-number">{String(index + 1).padStart(2, "0")}</span>
        <div><h4>{item.question}</h4><p>{item.intention}</p>
          {item.answer && <p className="sample-answer"><strong>Answer approach:</strong> {item.answer}</p>}</div>
      </article>)}</div>
  </section>
)

export default Home
