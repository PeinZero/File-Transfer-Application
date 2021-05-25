import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {history} from '../history'

export default class HomeUploadSent extends Component {
    render() {
        const {data} = this.props
        
        console.log(data)

        const to = _.get(data, 'to')
        const postId = _.get(data, '_id')
        return (
            <div className="app-card app-card-upload-sent">
                <div className="app-card-content">
                    <div className="app-card-content-inner">
                        <div className="app-home-uploading">
                            <div className="app-home-upload-sent-icon">
                                <i className="icon-paperplane"></i>
                            </div>

                            <div className="app-upload-sent-message app-text-center">
                                <h2>Files sent!</h2>
                                <p>A email is sent to {to} with a donwload link. The link will expire in 30 days.</p>
                            </div>

                            <div className="app-upload-sent-action app-form-action">
                                <button className="app-button primary" type={'button'} onClick = { () => {
                                    history.push(`/share/${postId}`)
                                }}> View Files </button>
                                <button className="app-button" type={'button'} onClick = {this.props.sendAgain}> Send Another File </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

HomeUploadSent.propTypes = {
    sendAgain: PropTypes.func,
}
