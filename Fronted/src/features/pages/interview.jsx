import { useRef, useState } from "react"
import { useAuth } from "../auth/hooks/useAuth"
import { createInterviewReport } from "../interview/services/interview.api"
import "../interview/style/resume-analyzer.scss"

const MAX_FILE_SIZE = 3 * 1024 * 1024

const getScoreLabel = (score) => {
  if (score >= 80) return "Strong match"
  if (score >= 60) return "Good foundation"
  if (score >= 40) return "Room to grow"
  return "Needs attention"
}

const Interview = () => {
  const { user, error: authError, handleLogout } = useAuth()
  const [jobDescription, setJobDescription] = useState("")
  const [selfDescription, setSelfDescription] = useState("")
  const [resume, setResume] = useState(null)
  const [report, setReport] = useState(null)
  const [error, setError] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const fileInputRef = useRef(null)
  const reportRef = useRef(null)

  const chooseResume = (file) => {
    if (!file) return

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
    if (!isPdf || file.size > MAX_FILE_SIZE) {
      setResume(null)
      setError(!isPdf ? "Please choose a PDF resume." : "Your resume must be 3 MB or smaller.")
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    setError("")
    setResume(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setReport(null)

    if (!resume) {
      setError("Choose your resume PDF before starting the analysis.")
      return
    }

    setIsGenerating(true)
    try {
      const response = await createInterviewReport({ resume, jobDescription, selfDescription })
      setReport(response.interviewReport)
      window.setTimeout(() => reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0)
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "We couldn't analyze your resume. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await handleLogout()
    } catch {
      // The auth hook exposes sign-out errors in the header.
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    chooseResume(event.dataTransfer.files?.[0])
  }

  return (
    <main className="analyzer-page">
      <header className="analyzer-topbar">
        <a className="analyzer-brand" href="/" aria-label="Resume Studio home">
          <span className="analyzer-brand-mark" aria-hidden="true">R</span>
          <span>resume studio</span>
        </a>
        <div className="analyzer-account">
          {user?.username && <span className="analyzer-welcome">Hi, {user.username}</span>}
          <button className="analyzer-signout" type="button" onClick={handleSignOut}>Sign out</button>
        </div>
      </header>

      {authError && <p className="analyzer-error auth-error" role="alert">{authError}</p>}

      <section className="analyzer-hero">
        <span className="analyzer-eyebrow"><span aria-hidden="true" /> YOUR NEXT CAREER MOVE, MADE CLEAR</span>
        <h1>Make your resume work <span>harder for you.</span></h1>
        <p>Get an AI-powered role match score and specific, practical ways to make your experience stand out.</p>
        <div className="analyzer-proof">
          <span><b aria-hidden="true">01</b> Upload your resume</span>
          <i aria-hidden="true" />
          <span><b aria-hidden="true">02</b> Add a target role</span>
          <i aria-hidden="true" />
          <span><b aria-hidden="true">03</b> Get your analysis</span>
        </div>
      </section>

      <section className="analyzer-layout">
        <form className="analyzer-form" onSubmit={handleSubmit}>
          <div className="analyzer-form-heading">
            <div>
              <span className="analyzer-kicker">PERSONALIZED ANALYSIS</span>
              <h2>Let’s get to know your goals</h2>
              <p>We’ll compare your experience with the role you want.</p>
            </div>
            <span className="analyzer-sparkle" aria-hidden="true">✳</span>
          </div>

          <label className="analyzer-label" htmlFor="jobDescription">
            Target job description <span>Required</span>
          </label>
          <textarea
            className="analyzer-textarea job-description"
            required
            id="jobDescription"
            name="jobDescription"
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            placeholder="Paste the job description here. Include responsibilities and qualifications for the most useful match score."
          />

          <label className="analyzer-label optional-label" htmlFor="selfDescription">
            What would you like us to know? <span>Optional</span>
          </label>
          <textarea
            className="analyzer-textarea about-description"
            id="selfDescription"
            name="selfDescription"
            value={selfDescription}
            onChange={(event) => setSelfDescription(event.target.value)}
            placeholder="Share your career goals or the experience you most want to highlight."
          />

          <label className="analyzer-label upload-label" htmlFor="resume">Your resume <span>PDF · 3 MB max</span></label>
          <label
            className={`analyzer-dropzone${resume ? " file-selected" : ""}`}
            htmlFor="resume"
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
          >
            <span className="analyzer-upload-icon" aria-hidden="true">{resume ? "✓" : "↑"}</span>
            <span className="analyzer-file-copy">
              <strong>{resume ? resume.name : "Drop your resume here"}</strong>
              <small>{resume ? "PDF ready to analyze" : "or click to browse your files"}</small>
            </span>
            <span className="analyzer-browse">{resume ? "Change file" : "Browse"}</span>
          </label>
          <input
            ref={fileInputRef}
            className="analyzer-file-input"
            type="file"
            id="resume"
            name="resume"
            accept="application/pdf,.pdf"
            onChange={(event) => chooseResume(event.target.files?.[0])}
          />

          {error && <p className="analyzer-error" role="alert">{error}</p>}
          <button className="analyzer-submit" type="submit" disabled={isGenerating}>
            {isGenerating ? <><span className="analyzer-spinner" aria-hidden="true" /> Analyzing your resume...</> : <>Analyze my resume <span aria-hidden="true">→</span></>}
          </button>
          <p className="analyzer-privacy"><span aria-hidden="true">⌑</span> Your resume is only used to create your personalized analysis.</p>
        </form>

        <aside className="analyzer-aside">
          <div className="aside-art" aria-hidden="true">
            <span className="art-orbit orbit-one" />
            <span className="art-orbit orbit-two" />
            <span className="art-spark spark-one">✳</span>
            <span className="art-spark spark-two">✦</span>
            <div className="art-score"><strong>82</strong><small>match</small></div>
            <div className="art-card"><i /><i /><i /><b /></div>
          </div>
          <span className="analyzer-kicker">A CLEARER WAY FORWARD</span>
          <h2>Know what’s working—and what to improve.</h2>
          <ul className="analyzer-benefits">
            <li><span>✓</span><div><strong>A role match score</strong><small>See how your experience aligns with the job.</small></div></li>
            <li><span>✓</span><div><strong>Priority skill gaps</strong><small>Focus on the areas that matter most.</small></div></li>
            <li><span>✓</span><div><strong>A practical action plan</strong><small>Turn feedback into your next steps.</small></div></li>
          </ul>
          <p className="analyzer-aside-note">Thoughtful feedback, grounded in the resume and role you provide.</p>
        </aside>
      </section>

      {report && <section className="analysis-results" ref={reportRef} aria-live="polite">
        <div className="results-heading">
          <div>
            <span className="analyzer-kicker">YOUR PERSONALIZED RESULTS</span>
            <h2>Your role match</h2>
            <p>Use this score as a guide to tailor your resume to this specific opportunity.</p>
          </div>
          <button className="analyzer-retry" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Analyze another role ↑</button>
        </div>

        <div className="results-overview">
          <div className="score-card">
            <div className="score-ring" style={{ "--score": `${Math.max(0, Math.min(100, report.matchScore || 0)) * 3.6}deg` }}>
              <div><strong>{report.matchScore ?? 0}</strong><span>out of 100</span></div>
            </div>
            <span className="score-label">{getScoreLabel(report.matchScore ?? 0)}</span>
            <small>ROLE MATCH</small>
          </div>
          <div className="score-message">
            <span className="analyzer-kicker">YOUR SNAPSHOT</span>
            <h3>{getScoreLabel(report.matchScore ?? 0)} for this opportunity</h3>
            <p>{report.skillGaps?.length
              ? `There ${report.skillGaps.length === 1 ? "is" : "are"} ${report.skillGaps.length} area${report.skillGaps.length === 1 ? "" : "s"} to strengthen. Start with the high-priority suggestions below.`
              : "Your report did not flag specific skill gaps. Review the preparation plan to make your application even stronger."}</p>
            <div className="score-bar" role="img" aria-label={`Role match score: ${report.matchScore ?? 0} out of 100`}>
              <span style={{ width: `${Math.max(0, Math.min(100, report.matchScore || 0))}%` }} />
            </div>
            <small>Match score based on the resume and job description you provided.</small>
          </div>
        </div>

        <section className="results-section">
          <div className="results-section-heading">
            <span className="result-section-icon" aria-hidden="true">↗</span>
            <div><h3>Suggestions to strengthen your match</h3><p>Use these priorities to focus your resume edits and preparation.</p></div>
          </div>
          {report.skillGaps?.length ? (
            <div className="suggestion-grid">
              {report.skillGaps.map((gap, index) => (
                <article className="suggestion-card" key={`${gap.skill}-${index}`}>
                  <span className={`priority-pill priority-${gap.severity}`}>{gap.severity} priority</span>
                  <h4>{gap.skill}</h4>
                  <p>Show how you’ve used {gap.skill} by adding a specific project, result, or example to your resume. If this is a new skill, outline a practical way you’re building it.</p>
                </article>
              ))}
            </div>
          ) : <p className="results-empty">No specific skill gaps were returned for this role. Keep your resume focused on the requirements in the job description.</p>}
        </section>

        {!!report.preparationPlan?.length && <section className="results-section plan-section">
          <div className="results-section-heading">
            <span className="result-section-icon" aria-hidden="true">✓</span>
            <div><h3>Your action plan</h3><p>A simple schedule to turn your results into progress.</p></div>
          </div>
          <div className="action-plan">
            {report.preparationPlan.map((day) => (
              <article className="action-day" key={day.day}>
                <span className="day-label">DAY {day.day}</span>
                <h4>{day.focus}</h4>
                <ul>{day.tasks?.map((task, index) => <li key={`${task}-${index}`}>{task}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>}

        {!!report.technicalQuestions?.length && <QuestionSection title="Technical questions to practice" items={report.technicalQuestions} />}
        {!!report.behavioralQuestions?.length && <QuestionSection title="Behavioral questions to practice" items={report.behavioralQuestions} />}
      </section>}
      <footer className="analyzer-footer">Built for your next step. <span>resume studio</span></footer>
    </main>
  )
}

const QuestionSection = ({ title, items }) => (
  <section className="results-section questions-section">
    <div className="results-section-heading">
      <span className="result-section-icon" aria-hidden="true">?</span>
      <div><h3>{title}</h3><p>Use the guidance to shape a clear, experience-based answer.</p></div>
    </div>
    <div className="practice-list">
      {items.map((item, index) => (
        <article className="practice-card" key={`${item.question}-${index}`}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div><h4>{item.question}</h4><p>{item.intention}</p>{item.answer && <small><strong>Answer approach:</strong> {item.answer}</small>}</div>
        </article>
      ))}
    </div>
  </section>
)

export default Interview
