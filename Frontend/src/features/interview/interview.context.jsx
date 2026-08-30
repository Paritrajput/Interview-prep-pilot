

import { createContext, useContext, useState } from "react";

// Context is internal to this file
const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [reports, setReports] = useState([]);

    return (
        <InterviewContext.Provider value={{ loading, setLoading, report, setReport, reports, setReports }}>
            {children}
        </InterviewContext.Provider>
    );
};

// Exported as useInterviewContext (avoiding the name useInterview)
export const useInterviewContext = () => {
    const context = useContext(InterviewContext);
    if (context === undefined) {
        throw new Error("useInterviewContext must be used within an InterviewProvider");
    }
    return context;
};