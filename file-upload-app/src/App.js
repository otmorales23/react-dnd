import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useDropzone} from 'react-dropzone';

function App() {
  const [file, setFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const { getRootProps, getInputProps } = useDropzone ({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length> 0){
        handleFileUpload(acceptedFiles[0]);
      }
    },
  });

  useEffect(() => {
    axios.get('http://localhost:5153/api/upload/files')
      .then((response) => {
        setFiles(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleFileUpload = (file) => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    axios.post('http://localhost:5153/api/upload/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      console.log(response.data.message); // Display success message

      // Fetch the updated list of file names after a successful upload.
      axios.get('http://localhost:5153/api/upload/files')
        .then((response) => {
          setFiles(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((error) => {
      console.error(error);
      alert('File upload failed');
    });
  };

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
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Drag and drop a file here, or click to select a file</p>
      </div>

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
