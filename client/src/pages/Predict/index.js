import React, { Component } from 'react';
// import './style.css';
import axios from 'axios';
// import { Redirect } from 'react-router-dom';


class Predict extends Component {
    constructor() {
        super()
        this.state = {
            predicted_value: "0",
            errorAlert: "",
            image: "",
            loading: false,
        }
    }


    render() {
        const { errorAlert } = this.state

        // Handles removing error text from alert onclick "x"
        const handleErrorAlert = e => {
            e.preventDefault()
            this.setState({ errorAlert: '' });
        }

        const handleTrain = e => {
            e.preventDefault()
            axios.post('/api/train/new', {

            }).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
                this.setState({ errorAlert: err.response.data.errors })
            })
        }

        // Handle change from inputs
        // const handleChange = e => {
        //     this.setState({ [e.target.name]: e.target.value })
        // }

        // const handlePredict = e => {
        //     this.setState({ loading: true })
        //     // this.setState({ image: this.sigPad.getTrimmedCanvas().toDataURL('base64string') })
        //     let file = this.sigPad.toDataURL('image/png');
        //     var formData = new FormData();
        //     formData.append('file', file);
        //     axios({
        //         url: '/api/predict/new',
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'multipart/form-data'
        //         },
        //         data: formData,
        //     }).then(res => {
        //         // console.log(res)
        //         console.log(res.data.data)
        //         this.setState({ predicted_value: res.data.data })
        //         this.setState({ loading: false })
        //         this.sigPad.clear()
        //     }).catch(err => {
        //         console.log(err)
        //         this.setState({ errorAlert: err.response.data.errors })
        //         this.setState({ loading: false })
        //     })
        // }

        return (
            <div>
                <div className="container">

                    {/* This is for any alerts/errors */}
                    {(errorAlert) ?
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            {errorAlert}
                            <button type="button" className="close" onClick={handleErrorAlert} data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        : null}

                    <div className="row">
                        <div className="col-lg-3 col-md-1"></div>
                        <div className="col-lg-6 col-md-10">
                            {/* Page Title */}
                            <div className="row">
                                <div className="col text-center mt-5">
                                    <h2>Predicting Songs</h2>
                                </div>
                            </div>

                            {/* This is where the prediction will be displayed */}
                            <div className="row">
                                <div className="col-3"></div>
                                <div className="col-6 text-center mt-3 mb-5">
                                    <p>Prediction</p>
                                    <button type="button" className="btn btn-primary" onClick={handleTrain}>Train Model</button>
                                </div>
                                <div className="col-3"></div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-1"></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Predict;