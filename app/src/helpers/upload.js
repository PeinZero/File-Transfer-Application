import axios from 'axios'
import _ from 'lodash';
import {apiUrl} from '../config'

export const upload = (form, callback = () => {}) => {

    const url = `${apiUrl}/upload`; 
    let files = _.get(form, 'files', [])
    let data = new FormData();

    _.each(files, (file) => {
        data.append('files', file)
    });

    data.append('to', _.get(form, 'to'))
    data.append('from', _.get(form, 'from'))
    data.append('message', _.get(form, 'message'))

    const config = {
        onUploadProgress: (event) => {
            return callback({
                type:'onUploadProgress',
                payload: event  
            })
        }
    }

    axios.post(url, data, config)
    .then( response => {
        return callback({
            type:'success',
            payload: response.data
        })
    })
    .catch( err => {
        return callback({
            type:'error',
            payload: err
        })
    })
} 