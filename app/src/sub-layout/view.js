import React, { Component } from 'react'
import _ from 'lodash';
import { getDownloadInfo } from '../helpers/download';
import { apiUrl } from '../config';
import converter from '../helpers/file-size';
import {history} from '../history'


export default class View extends Component {

    state = {
        post: null
    }

    componentWillMount(){
        const {match} = this.props;

        const postId = _.get(match, 'params.id');

        getDownloadInfo(postId)
        .then( response =>{
            this.setState({
                post: response.data
            })
        })
        .catch( err => {
            console.log("error", err)
        })
    }

    totalFileSizeHandler = () =>{
        const {post} = this.state
        let totalSize = 0
        const files = _.get(post, 'files', [])

        _.each(files, (file) => {
            totalSize = totalSize +  _.get(file, 'size', 0)
        })

        return converter(totalSize)
    }
    

    render() {
        const {post} = this.state;
        const files = _.get(post, 'files', [])
        const totalSize = this.totalFileSizeHandler()
        const postId =  _.get(post, '_id',null)

        return (
            <div className="app-page-download">
                <div className="app-top-header">
                    <h1 onClick = { () => {
                        history.push('/')
                    }}> <i className={"icon-paper-plane"} />  Rocket Share </h1>
                </div>
                <div className="app-card app-card-download">
                    <div className="app-card-content">
                        <div className="app-card-content-inner">
                            <div className="app-download-icon">
                                <i className="icon-download"></i>
                            </div>

                            <div className="app-download-message app-text-center">
                                <h2>Ready to download</h2>
                                <ul>
                                    <li>{files.length} files</li>
                                    <li>{totalSize}</li>
                                    <li>Expires in 30 days</li>
                                </ul>
                            </div>

                            <div className="app-download-file-list">
                                {
                                    files.map((file, index) => {
                                        return (
                                            <div key = {index} className="app-download-file-list-item">
                                                <div className="filename"> {_.get(file, 'originalname')}</div>
                                                <div className="download-action">
                                                    <a href={`${apiUrl}/download/${_.get(file,'_id')}`}> Download </a>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                
                            </div>

                            <div className="app-download-action app-form-action">
                                <a href = {`${apiUrl}/posts/${postId}/download`} className="app-button primary" >Download All</a>
                                <button className="app-button" type={'button'}> Share</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        )
    }
}
