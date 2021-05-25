import React, { Component } from 'react'
import Header from '../components/header'
import HomeForm from '../components/home-form'
import HomeUploading from '../components/home-uploading'
import HomeUploadSent from '../components/home-upload-sent'
import _ from 'lodash'

export default class Home extends Component {
    state = {
        componentName: 'HomeForm',
        // componentName: 'HomeUploading',
        // componentName: 'HomeUploadSent',
        data: null,
        uploadEvent: null,
    }
    

    renderComponentHandler = () =>{
        const {componentName, data, uploadEvent} = this.state;

        switch (componentName){
            case 'HomeUploading':
                return <HomeUploading cancel = { () => {
                    this.setState({
                        componentName: 'HomeForm',
                        data: null,
                        uploadEvent: null,
                    })
                }} data = {data} event = {uploadEvent} />

            case 'HomeUploadSent':
                return <HomeUploadSent data = {data}
                            sendAgain = { () =>{
                                this.setState({
                                    componentName: 'HomeForm'
                                })
                            }}
                />
            
            default:
                return <HomeForm 
                            onUploadBegin = { data => {
                                this.setState({
                                    data: data,
                                    componentName: 'HomeUploading'
                                })
                            }}
                            onUploadEvent = { event => {
                            
                                this.setState({
                                    data: (_.get(event, 'type') === 'success') ? _.get(event, 'payload') : this.state.data,
                                    uploadEvent: event,
                                    componentName: (_.get(event, 'type') === 'success') ? 'HomeUploadSent' : this.state.componentName
                                })
                            }}
                        />
        }
    }
 
    render() {
        return (
            <div className="app-container">
                <Header/>

                <div className="app-content">
                    {this.renderComponentHandler()}
                </div>
                
            </div>
        )
    }
}
