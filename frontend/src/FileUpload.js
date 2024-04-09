

import React from 'react'
import { useState } from 'react'
function FileUpload() {
  const [formData, setFormData] = useState({
    inputText: '',
    file: null
  })
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [message, setMessage] = useState('')
  const baseUrl = 'https://gd1urnjh12.execute-api.us-east-2.amazonaws.com/prod/'
  const uploadFileToS3 = async (file, signedUrl) => {
    try {
      setIsLoaded(true);
      const response = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to upload file to S3');
      }
      return true
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      return false
    }
  };
  const CreateDynamoDBItem = async (text, filePath) => {
    try {
      const response = await fetch(`${baseUrl}createrecord?text=${text}&filePath=${filePath}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (response.status === 201) {
        const responseData = await response.json();
        setMessage('Item inserted successfully');
      }
    } catch (error) {
      console.error('Error inserting item:', error);
    }
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setMessage('Uploading file...');
      setIsLoaded(true);
      const signedurl = await fetch(`${baseUrl}signedurl?filename=${formData?.file?.name}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (signedurl.status === 200) {
        setIsLoaded(false);
        setMessage('File uploaded successfully');
        const responseData = await signedurl.json();
        console.log("signed response", responseData);
        const { url, filePath } = responseData;
        const response = await uploadFileToS3(formData.file, url);
        if (response) {
          setMessage('File uploaded successfully');
          CreateDynamoDBItem(formData.inputText, filePath);
        }

      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    const { files, name, value } = e.target
    if (files) {
      setFormData({
        ...formData,
        [name]: files[0]
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }
  return (
    <div>
      <div className='border m-2 py-8 px-2 rounded shadow bg-gray-400'>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <div className='flex'>
            <label className='basis-1/3'>Input Text</label>
            <input type="text" className='basis-2/3 p-2 rounded ' name='inputText' onChange={handleInputChange} />
          </div>
          <div className='flex '>
            <label className='basis-1/3'>Input File</label>
            <input type="file" className='basis-2/3' name='file' onChange={handleInputChange} />
          </div>
          {isLoaded ? "..loading" : <button type='submit'>Submit</button>}
        </form>
        {message.length > 0 && <p>{message}</p>}
      </div>
    </div>
  )
}

export default FileUpload