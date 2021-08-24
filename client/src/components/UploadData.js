import React, { useState } from 'react';
import axios from 'axios';
import {Button, Form} from "react-bootstrap";
import Swal from 'sweetalert2'

const API_BASE = "http://localhost:8080"

function submitForm(contentType, data) {
    axios.post(`${API_BASE}/api/data`,data,{
    }).then((response) => {
        Swal.fire({
            title: 'Success',
            text:response.data.status,
            icon:'success'
        })
    }).catch((error) => {
        Swal.fire({
            title: 'Error!',
            text:error.message,
            icon:'error'
        })
    })
}


function UploadData() {
    const [file, setFile] = useState(null);

    function uploadWithFormData(){
        if (!file)
            return;
        const formData = new FormData();
        formData.append("file", file);
        submitForm("multipart/form-data", formData);
    }

    return (
        <div align='center' className='file-upload'>
            <Form.Control className='file-select'  onChange={(e) => setFile(e.target.files[0])} type="file" id="files"/>
            <Form.Label htmlFor="files">
                <Button disabled={!file} onClick={uploadWithFormData} className='file-upload btn btn-primary'>Send</Button>
            </Form.Label>
        </div>
    );
}

export default UploadData;
