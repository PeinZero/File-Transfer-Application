import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import converter from '../helpers/file-size'

export default class HomeUploading extends Component {
    state = {
        startTime: new Date(),
        lastLoaded: 0,
        uploadSpeed: 0,
        data: null,
        percentage: 0,
        loaded: 0,
        total: 0,
    }

    componentDidMount(){
        const {data} = this.props;

        this.setState({
            data: data,
        })
    }

    componentWillReceiveProps(nextProps){
        const {event} = nextProps;

        switch (_.get(event, 'type')){
            case 'onUploadProgress':
                const loaded = _.get(event, 'payload.loaded', 0);
                const total =_.get(event, 'payload.total', 0);
                const percentage = total !== 0 ? (loaded/total)*100  : 0;
                
                const currentTime = new Date();
                let currentMinusStartTime = currentTime - this.state.startTime;

                if (currentMinusStartTime === 0){
                    currentMinusStartTime = 1
                }

                let uploadSpeed = ((loaded-this.state.lastLoaded)/currentMinusStartTime)*1000

                this.setState({
                    startTime: currentTime,
                    lastLoaded:  loaded,
                    loaded: loaded,
                    total: total,
                    percentage: _.round(percentage),
                    uploadSpeed: uploadSpeed,
                })
                
                break;
            
            default:
            
                break;
        }

        this.setState({
            event: event,
        })
    }

    render() {
        const {percentage, data, loaded, total, uploadSpeed} = this.state
        const totalFiles = _.get(data, 'files', []).length

        return (
            <div className="app-card app-card-uploading">
                    <div className="app-card-content">
                        <div className="app-card-content-inner">
                            <div className="app-home-uploading">
                                <div className="app-home-uploading-icon">
                                    <i className="icon-upload"></i>
                                    <h2>Sending...</h2>
                                </div>
                            </div>

                            <div className="app-upload-files-total">
                                Uploading {totalFiles} files.
                            </div>

                            <div className="app-progress">
                                <span style = {{ width: `${percentage}%` }} className="app-progress-bar"></span>
                            </div>

                            <div className="app-upload-stats">
                                <div className="app-upload-stats-left">{converter(loaded)}/{converter(total)}</div>
                                <div className="app-upload-stats-right">{converter(uploadSpeed)}/s</div>
                            </div>

                            <div className="app-form-action">
                                <button onClick = { () => {
                                    if(this.props.cancel){
                                        this.props.cancel(true)
                                    }

                                }} className="app-upload-cancel-button app-button" type = {'button'} >Cancel </button>
                            </div>
                        </div>
                    </div>
            </div>
        )
    }
}

HomeUploading.propTypes = {
    data: PropTypes.object,
    event: PropTypes.object,
    cancel: PropTypes.func
}
