import React, { useState } from 'react';
import './App.css';
import logo from './assets/clarklogo6.jpg';

function App() {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [type, setType] = useState('');
  const [Report, setReport] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reportData = {
        name: name,
        studentId: studentId,
        type: type,
        report: Report, 
        location: location,
        time: time,
        additionalInfo: additionalInfo
    };

    try {
        const response = await fetch('http://localhost:5000/api/report-crime', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reportData),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data.message); 
            setSubmitted(true); 
        } else {
            console.error('Error submitting report:', response.statusText);
        }
    } catch (error) {
        console.error('Error submitting report:', error);
    }
};

  return (
    <div className="App">
    <img src={logo} alt="Clark University Logo" className="clarklogo" />
     <h1 style={{ marginTop: '2px' }}>Clark University Crime Log</h1>

      {!submitted ? (
        <form className="report-form" onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
            />
          </label>

          <label>
            Clark ID:
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              placeholder="Enter your Clark ID"
            />
          </label>

          <label>
            Type of Crime:
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              placeholder="Enter the Nature of the Crime"
            />
          </label>

          <label>
            Details:
            <textarea
              value={Report}
              onChange={(e) => setReport(e.target.value)}
              required
              placeholder="Describe the incident"
            ></textarea>
          </label>

          <label>
            Where did this incident occur?:
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              placeholder="Enter the location"
            />
          </label>

          <label>
            Time of the incident:
            <input
              type="time" 
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              placeholder="Enter the time"
            />
          </label>

          <label>
            Additional Information:
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Enter any other important details, including description of perpetrator:"
            ></textarea>
          </label>

          <button type="submit">Submit Report</button>
        </form>
      ) : (
        <div className="thank-you-message">
          <h2>Thank you for your report!</h2>
          <p>We have received your submission. University Police will review it shortly and will reach out within 24 hours.</p>
        </div>
      )}
    </div>
  );
}

export default App;
