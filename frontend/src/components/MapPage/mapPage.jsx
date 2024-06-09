import  { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const onDrop = (acceptedFiles) => {
        const uploadedFile = acceptedFiles[0];
        setFile(uploadedFile);
        setPreview(URL.createObjectURL(uploadedFile));
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleUpload = () => {
        const formData = new FormData();
        formData.append('file', file);

        axios.post(`${API_BASE_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(response => {
            console.log('File uploaded successfully', response.data);
        })
        .catch(error => {
            console.error('Error uploading file', error);
        });
    };

    return (
        <div>
            <div {...getRootProps()} style={{ border: '1px dashed gray', padding: '20px', textAlign: 'center' }}>
                <input {...getInputProps()} />
                <p>Загрузите файл карты</p>
            </div>
            {preview && (
                <div>
                    <img src={preview} alt="Preview" style={{ marginTop: '20px', maxHeight: '400px' }} />
                </div>
            )}
            {file && (
                <button onClick={handleUpload} style={{ marginTop: '20px' }}>
                    Upload File
                </button>
            )}
        </div>
    );
};

export default FileUpload;
