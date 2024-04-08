

import React from 'react'
import { useState } from 'react'
function FileUpload() {
  const [formData, setFormData] = useState({
    inputText: '',
    file: null
  })
  const baseUrl = 'https://gd1urnjh12.execute-api.us-east-2.amazonaws.com/main/'
  const uploadFileToS3 = async (file, signedUrl) => {
    console.log(file, signedUrl)
    try {
      const response = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to upload file to S3');
      }

      console.log('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file to S3:', error);
    }
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const signedurl = await fetch(`${baseUrl}signedurl?filename=${formData?.file?.name}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      console.log("res==", signedurl);
      if (signedurl.status === 200) {
        const responseData = await signedurl.json();
        console.log(responseData);
        const response = await uploadFileToS3(formData.file, responseData.url);
        console.log(response);

      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    const { files, name, value } = e.target
    console.log(files, name, value)
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
          <button type='submit'>Submit</button>
        </form>
      </div>
    </div>
  )
}

export default FileUpload