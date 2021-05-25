import React, { Component } from 'react'
import _ from 'lodash'
import classNames from 'classnames'
import {upload} from '../helpers/upload'
import PropTypes from 'prop-types'

export default class HomeForm extends Component {
    state = {
        form:{
            files: [],
            to: '',
            from: '',
            message: ''
        },
        
        errors:{
            files:null,
            to: null,
            from: null,
            message: null,
        }
    }

    isValidEmail(email){
        const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return emailRegex.test(email)
    }

    formValidationHandler = (fields = [], callback = () => {}) => {
        
        let {form, errors} = this.state;
        const validations = {
            from: [
                {
                    errorMessages: 'From is required',
                    isValid: () =>{
                        return form.from.length;
                    }
                },
                {
                    errorMessages: 'Please enter a valid email address.',
                    isValid: () =>{
                        return this.isValidEmail(form.from)
                    }
                },
            ],
            to: [
                {
                    errorMessages: 'To is required',
                    isValid: () =>{
                        return form.to.length;
                    }
                },
                {
                    errorMessages: 'Please enter a valid email address.',
                    isValid: () =>{
                        return this.isValidEmail(form.to)
                    }
                },
            ],
            files : [
                {
                    errorMessages: 'Files are required',
                    isValid: () =>{
                        return form.files.length;
                    }
                },
            ]

        }

        _.each(fields, (field) =>{
            let fieldValidation = _.get(validations, field, []) // validations[field]
            
            errors[field] = null;

            _.each(fieldValidation, (fieldValidation) =>{
                const isValid = fieldValidation.isValid()
                if (!isValid){
                    errors[field] = fieldValidation.errorMessages
                }
            })
        })

        this.setState(
            {errors:errors},
            () => {
                let isValid = true;
                _.each(errors, (err) => {
                    if(err != null){
                        isValid = false
                    }
                })
                return callback(isValid)
            }
        )
    }

    changeFormHandler = (event) =>{
        let form = this.state.form
        form[event.target.name] = event.target.value
        this.setState({form:form})
    }

    onFormSubmitHandler = (event) =>{
        event.preventDefault()
        this.formValidationHandler(['from','to', 'files'], (isValid) => {
            if (isValid){
                
                const data = this.state.form

                if(this.props.onUploadBegin){
                    this.props.onUploadBegin(data)
                }
                upload(data, (event) => {
                    if(this.props.onUploadEvent){
                        this.props.onUploadEvent(event)
                    }
                })  
            }

            let form = this.state.form
            let errors = this.state.errors
            if (errors.to !== null){
                form.to = ''
            }
            if (errors.from !== null){
                form.from = ''
            }
            
            this.setState({
                form:form
            })

        })
    }

    onFileAddHandler = (event) =>{
        
        let files = _.get(this.state, "form.files", [])

        _.each(_.get(event, "target.files", []), (file) =>{
            files.push(file)
        })

        this.setState({
            form:{
                ...this.state.form,
                files:files,
            }
        })
        // }, () => {
        //     this.formValidationHandler(['files'], (isValid) =>{
  
        //     }) 
        // })
    }
    
    onFileRemoveHandler = (index) =>{
        let {files} = this.state.form
        files.splice(index, 1);

        this.setState({
            form:{
                ...this.state.form,
                files:files
            }
        })
    }

    render() {

        const {form, errors} = this.state
        const {files} = form;
        return (
            <div className="app-card">
                <form onSubmit = {this.onFormSubmitHandler} > 
                    <div className="app-card-header">
                        <div className="app-card-header-inner">
                            {
                                files.length ?  <div className="app-files-selected">
                                    {
                                        files.map((file, index) => {
                                            return(
                                                <div key = {index} className="app-files-selected-item">
                                                    <div className="filename">{file.name}</div>
                                                    <div className="file-action">
                                                        <button onClick = {() => this.onFileRemoveHandler(index) } type = {'button'} className="app-files-remove">X</button>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div> : null
                            }

                            <div className={classNames("files-upload", {'error': _.get(errors, 'files')})}>
                                <label htmlFor = {'input-file'}>
                                    <input onChange = {this.onFileAddHandler} id = {'input-file'}type="file" multiple={true} />
                                    {
                                        files.length ? <span className="files-upload-description text-uppercase" > Add more files </span> : 
                                        <span>
                                            <span className="files-upload-icon"><i className= {"icon-picture-o"} /> </span>
                                            <span className="files-upload-description">Drag and drop your files here.</span>
                                        </span> 
                                    }
                                    
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="app-card-content">
                        <div className="app-card-content-inner">
                            <div className={classNames("app-form-item", {'error': _.get(errors, 'to')})}>
                                <label htmlFor={'to'}>Send to</label>
                                <input onChange = {this.changeFormHandler} value = {_.get(form, 'to')} name = {'to'} placeholder = {_.get(errors, 'to') ? _.get(errors, 'to') : "Email address"} type={'text'} id = {'to'} />
                            </div>

                            <div className={classNames("app-form-item", {'error': _.get(errors, 'from')})}>
                                <label htmlFor={'from'}>From</label>
                                <input onChange = {this.changeFormHandler} value = {_.get(form, 'from')} name = {'from'} placeholder = {_.get(errors, 'from') ? _.get(errors, 'from') : "Your email address"} type={'text'} id = {'from'} />
                            </div>

                            <div className="app-form-item">
                                <label htmlFor={'message'}>Message</label>
                                <textarea onChange = {this.changeFormHandler} value = {_.get(form, 'message')} placeholder = {'Add a note (optional)'} id = {'message'} name = {'message'} />
                            </div>

                            <div className="app-form-action">
                                <button type = {'submit'} className={'app-button primary'}>Send</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

HomeForm.propTypes ={
    onUploadBegin: PropTypes.func,
    onUploadEvent: PropTypes.func,
}
