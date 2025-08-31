import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
// import './App.css'; // Remove old CSS import

function App() {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [senderName, setSenderName] = useState('');
  const [csvData, setCsvData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setFileName(file.name);
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setCsvData(results.data);
          setMessage(`CSV loaded successfully! ${results.data.length} records found.`);
          setMessageType('success');
          setShowPreview(true);
        },
        error: (error) => {
          setMessage(`Error parsing CSV: ${error.message}`);
          setMessageType('error');
        }
      });
    } else {
      setMessage('Please select a valid CSV file.');
      setMessageType('error');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
    
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      setFileName(file.name);
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setCsvData(results.data);
          setMessage(`CSV loaded successfully! ${results.data.length} records found.`);
          setMessageType('success');
          setShowPreview(true);
        },
        error: (error) => {
          setMessage(`Error parsing CSV: ${error.message}`);
          setMessageType('error');
        }
      });
    } else {
      setMessage('Please drop a valid CSV file.');
      setMessageType('error');
    }
  };

  const handleSendEmails = async () => {
    if (!subject.trim() || !content.trim() || csvData.length === 0) {
      setMessage('Please fill in all fields and upload a CSV file.');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/send-emails', {
        subject: subject.trim(),
        content: content.trim(),
        senderName: senderName.trim(),
        csvData: csvData
      });

      if (response.data.success) {
        setMessage(response.data.message);
        setMessageType('success');
        
        // Show statistics
        setTimeout(() => {
          setMessage(`${response.data.message}\n\nSuccess: ${response.data.success_count}\nFailed: ${response.data.error_count}`);
        }, 1000);
      } else {
        setMessage(response.data.error || 'Failed to send emails');
        setMessageType('error');
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Network error occurred');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setSubject('');
    setContent('');
    setSenderName('Hostel Management Team');
    setCsvData([]);
    setFileName('');
    setMessage('');
    setMessageType('');
    setShowPreview(false);
  };

  return (
    <div className={darkMode ? 'min-h-screen bg-gray-900 text-white transition-colors duration-300' : 'min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300'}>
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">📧 Email Sender</h1>
            <p className="text-gray-500 dark:text-gray-300">Bulk Email Sender</p>
          </div>
          
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${messageType === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : messageType === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}` }>
            {message.split('\n').map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Email Configuration</h2>
          <div className="mb-4">
            <label htmlFor="subject" className="block font-medium mb-1">Subject:</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject..."
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="senderName" className="block font-medium mb-1">Sender Name:</label>
            <input
              type="text"
              id="senderName"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Enter sender name (e.g., Hostel Management Team)"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block font-medium mb-1">Email Content:</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter email content... (HTML supported)"
              rows="8"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">CSV Upload</h2>
          <p className="mb-4 text-gray-500 dark:text-gray-300">
            Upload a CSV file with columns: <strong>email</strong>, <strong>name</strong>, <strong>lastname</strong>
          </p>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${fileName ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('csvFile').click()}
          >
            <input
              type="file"
              id="csvFile"
              accept=".csv"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <div>
              <div className="text-5xl mb-2">📁</div>
              <p>Click to select or drag and drop a CSV file here</p>
              {fileName && <p className="mt-2 font-semibold">Selected: {fileName}</p>}
            </div>
          </div>
          {showPreview && csvData.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Preview ({csvData.length} records)</h3>
              <div className="overflow-x-auto max-h-72">
                <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
                  <thead>
                    <tr>
                      {Object.keys(csvData[0]).map((header) => (
                        <th key={header} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-left font-semibold border-b border-gray-200 dark:border-gray-600">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(0, 5).map((row, index) => (
                      <tr key={index} className="even:bg-gray-50 dark:even:bg-gray-800">
                        {Object.values(row).map((value, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">{value}</td>
                        ))}
                      </tr>
                    ))}
                    {csvData.length > 5 && (
                      <tr>
                        <td colSpan={Object.keys(csvData[0]).length} className="text-center italic py-2">... and {csvData.length - 5} more records</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
          <div className="flex gap-4 justify-center">
            <button
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={handleSendEmails}
              disabled={isLoading || !subject.trim() || !content.trim() || !senderName.trim() || csvData.length === 0}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-blue-400 rounded-full"></span> Sending Emails...
                </>
              ) : (
                '📤 Send Emails'
              )}
            </button>
            <button
              className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={clearForm}
              disabled={isLoading}
            >
              🗑️ Clear Form
            </button>
          </div>
        </div>

        {csvData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
            <h3 className="font-semibold mb-4">Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{csvData.length}</div>
                <div className="text-gray-600 dark:text-gray-300">Total Recipients</div>
              </div>
              <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{csvData.filter(row => row.email).length}</div>
                <div className="text-gray-600 dark:text-gray-300">Valid Emails</div>
              </div>
              <div className="bg-red-100 dark:bg-red-900 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{csvData.filter(row => !row.email).length}</div>
                <div className="text-gray-600 dark:text-gray-300">Missing Emails</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
