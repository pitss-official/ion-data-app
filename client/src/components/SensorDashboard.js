import React, {Component} from "react";
import {Line} from "react-chartjs-2";
import axios from "axios";
import {Button, Form, Spinner} from "react-bootstrap";
import _ from 'lodash';
import Swal from "sweetalert2";

const API_BASE = "http://localhost:8080"

export default class SensorDashboard extends Component{
    constructor(props) {
        super(props);
        this.state={
            data:[],
            selectedSensorId:'',
            chartData:[],
            loading: false,
            groupBy:['day','month','year']
        }
    }

    handleCheckboxes = (name,isChecked)=>{
        if(isChecked){
            this.setState((state)=>({
                groupBy: _.uniq([...state.groupBy, name])
            }))
        }else{
            this.setState((state)=>({
                groupBy: _.remove(state.groupBy,val=>val!== name)
            }))
        }
    }

    handleFetch = ()=>{
        if (!this.state.selectedSensorId){
            return;
        }

        this.setState({
            loading:true
        })

        axios.get(`${API_BASE}/api/data`,{
            params:{
                sensorId:this.state.selectedSensorId,
                groupBy:this.state.groupBy
            }
        }).then(({data})=>{
            let chartData=[{
                    label: this.state.selectedSensorId,
                    data: data.map(({avgTmp})=>avgTmp),
                    fill:false,
                    borderColor: `rgb(${_.random(255)}, ${_.random(255)}, ${_.random(255)})`,
                    tension: 0.1
                }]

            console.log(chartData)

            this.setState({
                loading:false,
                chartData:{
                    datasets: chartData,
                    labels:data.map(({_id:{date}})=>{
                        return new Date(..._.compact(date.year,date.month,date.day,date.hour,date.minute)).toLocaleDateString()
                    })
                }
            })
        }).catch(()=>Swal.fire('Error','Something went wrong while fetching data from server.','error'))
    }

    objToStr = (obj,filters)=>{
    }

    render(){
        return(
            <div className='container'>
                <div className='form-controls'>
                    <h5>Select data to fetch</h5>
                    <Form.Control onChange={({target:{value}})=>this.setState({selectedSensorId:value.trim()})} className='spacing-xs' type='text' placeholder='Sensor Id'/>
                    <Form.Label>Additional data granularity (Optional)</Form.Label>
                    <Form.Check type="checkbox" label="Hour" onChange={({target:{checked}})=>this.handleCheckboxes('hour',checked)} />
                    <Form.Check type="checkbox" label="Minute" onChange={({target:{checked}})=>this.handleCheckboxes('minute',checked)} />
                    <Button disabled={!this.state.selectedSensorId} className='spacing-xs' onClick={this.handleFetch}>Fetch</Button>
                </div>

                {
                    this.state.loading && <div className='loading-spinner'>

                    <Spinner animation='border'/>
                    </div>
                }
                {
                    !this.state.loading && <Line data={this.state.chartData} />
                }
            </div>
        );
    }
}
