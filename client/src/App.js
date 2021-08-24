import React, {useRef} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SensorDashboard from "./components/SensorDashboard";
import UploadData from "./components/UploadData";
import {Card} from "react-bootstrap";

class App extends React.Component{
    render() {
        return (
            <div className="App">
                <div className='container'>
                    <Card className='file-upload-modal'>
                        <Card.Header>Upload file</Card.Header>

                        <Card.Body><UploadData/></Card.Body>
                    </Card>
                    <br/>

                    <SensorDashboard/>
                </div>
            </div>
        );
    }
}


export default App;
