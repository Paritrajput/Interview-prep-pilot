import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useEffect } from "react"
import { useInterviewContext } from "../interview.context"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useInterviewContext()
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        let response = null
        const maxRetries = 3
        const baseDelayMs = 3000
        let lastError = null

        try {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
                    if (response && response.interviewReport) {
                        setReport(response.interviewReport)
                        return response.interviewReport
                    }
                    // If API returned but payload is invalid, stop retrying
                    lastError = new Error('Interview report response was invalid')
                    break
                } catch (err) {
                    lastError = err
                    const status = err.status || (err.message && /service unavailable|temporar/i.test(err.message) ? 503 : null)

                    // Retry only on 503 / transient service errors or network failures
                    const shouldRetry = (status === 503) || /network error/i.test(err.message || '') || /service unavailable/i.test(err.message || '')

                    if (attempt < maxRetries && shouldRetry) {
                        const delay = baseDelayMs * attempt
                        // eslint-disable-next-line no-await-in-loop
                        await new Promise(r => setTimeout(r, delay))
                        continue
                    }

                    // Non-retriable or retries exhausted
                    break
                }
            }

            console.error('Generate report failed after retries:', lastError)
            return null
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
            throw error
        } finally {
            setLoading(false)
        }
        return response.interviewReport
    }

    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            console.log(error)
            throw error
        } finally {
            setLoading(false)
        }

        return response.interviewReports
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        let response = null
        try {
            response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }
        catch (error) {
            console.log(error)
            throw error;
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }

}