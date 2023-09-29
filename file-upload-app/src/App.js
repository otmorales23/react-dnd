import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5153/api/upload/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data.message);

      const updatedFileListResponse = await axios.get('http://localhost:5153/api/upload/files');
      setFiles(updatedFileListResponse.data);

      setFile(null);
    } catch (error) {
      console.error(error);
      alert('File upload failed');
    }
  };

  useEffect(() => {
    axios.get('http://localhost:5153/api/upload/files')
      .then((response) => {
        setFiles(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleDownload = (fileName) => {
    axios({
      url: 'http://localhost:5135/api/upload/download/' + fileName,
      method: 'GET',
      responseType: 'blob',
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error(error);
        alert('File download failed.');
      });
  };

  return (
    <div className="App">
      <h1>File Upload</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>

      <h1>File List</h1>
      <ul>
        {files.map((file) => (
          <li key={file}>
            {file} <button onClick={() => handleDownload(file)}>Download</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

