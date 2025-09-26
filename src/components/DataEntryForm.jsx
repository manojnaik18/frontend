import { useState, useEffect } from 'react';
import { addResult, getSubjects } from '../api/api';
import './DataEntryForm.css';

export default function DataEntryForm() {
    const [studentName, setStudentName] = useState('');
    const [subject, setSubject] = useState('');
    const [className, setClassName] = useState('8th A'); // Default class
    const [subjectsList, setSubjectsList] = useState([]);
    const [score, setScore] = useState('');
    const [message, setMessage] = useState('');
    const [showForm, setShowForm] = useState(false); // <-- toggle state

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await getSubjects();
                const fetchedSubjects = response.data;
                setSubjectsList(fetchedSubjects);
                if (fetchedSubjects.length > 0) {
                    setSubject(fetchedSubjects[0].name);
                }
            } catch (error) {
                console.error("Could not fetch subjects:", error);
            }
        };
        fetchSubjects();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const numericScore = Number(score);

        if (numericScore < 0 || numericScore > 100) {
            setMessage('Score must be between 0 and 100.');
            return;
        }

        try {
            await addResult({ studentName, subjectName: subject, score: numericScore, className });
            setMessage('✅ Success! Result added.');
            setStudentName('');
            setScore('');
            if (subjectsList.length > 0) {
                setSubject(subjectsList[0].name);
            }
            setShowForm(false); // <-- hide form after submit
        } catch (err) {
            console.error("Error submitting result:", err);
            setMessage('❌ Error adding result');
        }
    };

    return (
        <div className="content-container form-container">
            {!showForm ? (
                <button className="toggle-btn" onClick={() => setShowForm(true)}>
                    ➕ Add Details
                </button>
            ) : (
                <>
                    <h2>Enter Student Score</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            placeholder="Student Name"
                            value={studentName}
                            onChange={e => setStudentName(e.target.value)}
                            required
                        />
                        <input
                            placeholder="Class"
                            value={className}
                            onChange={e => setClassName(e.target.value)}
                            required
                        />
                        <select value={subject} onChange={e => setSubject(e.target.value)} required>
                            {subjectsList.length === 0 ? (
                                <option disabled>Loading subjects...</option>
                            ) : (
                                subjectsList.map(s => (
                                    <option key={s._id} value={s.name}>{s.name}</option>
                                ))
                            )}
                        </select>
                        <input
                            placeholder="Score (in 100)"
                            type="number"
                            value={score}
                            min="0"
                            max="100"
                            onChange={e => setScore(e.target.value)}
                            required
                        />
                        <div className="form-actions">
                            <button type="submit">Submit</button>
                            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </>
            )}
            {message && <p className="message">{message}</p>}
        </div>
    );
}
