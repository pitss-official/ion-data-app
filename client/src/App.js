import React, {useRef} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Form, Button} from "react-bootstrap";
import {Line} from "react-chartjs-2";
import UploadData from "./components/UploadData";

class App extends React.Component{


    data = {
        labels: ['1', '2', '3', '4', '5', '6'],
        datasets: [
            {
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
            },
        ],
    }
    handleFileInput = ()=>{

    }

    render() {
        return (
            <div className="App">
                <div className='container'>
                    <UploadData/>

                    <Line data={this.data} />
                </div>
            </div>
        );
    }
}


export default App;
