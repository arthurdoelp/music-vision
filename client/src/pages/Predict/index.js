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
            similar_songs: [],
            adjusted_r_squared: "",
            total_plays: 0,
            total_revenues: 0,
            song_name: ""
        }
    }


    render() {
        const { errorAlert, uploadPercentage, file_name, similar_songs, adjusted_r_squared, total_plays, total_revenues, song_name } = this.state

        // Handles removing error text from alert onclick "x"
        const handleErrorAlert = e => {
            e.preventDefault()
            this.setState({ errorAlert: '' });
        }

        const handlePredict = e => {
            e.preventDefault()
            console.log(e.target.files[0]);
            let file_type_m4a = e.target.files[0].type.toLowerCase().includes("m4a");
            let file_size = e.target.files[0].size;

            if (file_type_m4a) {
                if (file_size <= 20000000) {
                    var file = e.target.files[0];
                    var formData = new FormData();
                    formData.append('file', file);

                    axios({
                        url: '/api/predict/new',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        data: formData,
                        onUploadProgress: (progressEvent) => {
                            let percent = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
                            this.setState({ uploadPercentage: percent })
                        }
                    })
                        .then(res => {
                            console.log(res.data.data)
                            // let song_name = file.name.slice(0, -4)
                            // let similar_songs = res.data.data.similar_songs
                            // for (let i = 0; i < similar_songs.length; i++) {
                            //     for (let j = 0; j < similar_songs[i].length; j++) {
                            //         similar_songs[i] = similar_songs[i].replace("_", " ")
                            //     }
                            // }
                            // this.setState({
                            //     file_name: file.name,
                            //     uploadPercentage: 0,
                            //     similar_songs: similar_songs,
                            //     adjusted_r_squared: res.data.data.adjusted_r_squared,
                            //     total_plays: res.data.data.total_plays,
                            //     total_revenues: res.data.data.total_revenues,
                            //     song_name: song_name
                            // })
                        })
                        .catch(err => {
                            console.log(err)
                            this.setState({ errorAlert: err.response.data.errors })
                        });
                } else {
                    this.setState({ errorAlert: "The file size you uploaded needs to be less than 20mb" })
                }
            } else {
                this.setState({ errorAlert: "The file format you uploaded needs to be .m4a" })
            }
        }

        return (
            <div>
                {/* Navbar */}
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="/">Music Vision</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarText">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <a className="nav-link active" aria-current="page" href="https://github.com/arthurdoelp/music-vision"><img alt="github" src="../../../Images/github.ico" height="25px"/></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

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
                            <div className="row mt-5">
                                <div className="col text-center mt-5">
                                    <h1>Music Vision</h1>
                                    <h5>Song Forecasting</h5>
                                    <p>Select a song from your computer to discover similar sounding songs and forecast the potential revenues</p>
                                </div>
                            </div>

                            {/* File input */}
                            <div className="form-row">
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="file"></label>
                                        <div className="file-input-wrapper">
                                            <div className="row">
                                                <div className="col-7 pt-3">
                                                    {file_name ?
                                                        <p className="file-selected-true">{file_name}</p>
                                                        : <p className="file-selected-false">No file selected</p>
                                                    }
                                                </div>
                                                <div className="col-5 pt-2">
                                                    <input
                                                        type="file"
                                                        id="file"
                                                        name="file"
                                                        onChange={handlePredict}
                                                        className="file-input-button"
                                                        required
                                                    />
                                                    <label htmlFor="file">Add File</label>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="text-center">
                                            <small>File maximum: 20mb, format: .m4a | FYI: Most iTunes songs are in .m4a format</small><br></br>
                                            <small>Disclaimer: No files or information will be saved</small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Upload File Progress Bar */}
                            {uploadPercentage > 0 ?
                                <div className="form-row mb-2">
                                    <div className="col">
                                        <div className="progress">
                                            <div className="progress-bar progress-bar-striped bg-info progress-bar-animated"
                                                role="progressbar"
                                                aria-valuenow={uploadPercentage}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                                style={{ width: `${uploadPercentage}%` }}></div>
                                        </div>
                                        <div className="text-center">
                                            <p>This will take about 1.5 minutes. Sorry for the wait. There's a lot going on behind the scenes...</p>
                                        </div>
                                    </div>
                                </div>
                                : null}

                            {/* Song Summary */}
                            {(adjusted_r_squared && total_revenues && total_plays) ?
                                <div className="form-row mt-2">
                                    <div className="col">
                                        <div className="row">
                                            <div className="col text-center">
                                                <h3>Forecast Summary</h3>
                                                <p>Below is a summary of the song you selected to forecast</p>
                                            </div>
                                        </div>

                                        <div className="row song-summary-stats">
                                            <div className="col">
                                                <h4>Similar Songs</h4>
                                                <p>Here is a list of songs the model found to be similar to your selected song (no particular order).</p>
                                                <ul className="similar-songs">
                                                    {similar_songs.map(song => (
                                                        <li id={song} key={song}><small><strong>{song}</strong></small></li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="col">
                                                <h4>Summary Statistic</h4>
                                                <p>There is a <strong>{adjusted_r_squared}</strong> chance on average that <strong>{song_name}</strong> will have a present value of total revenues (discounted at 10% yearly) of <strong>${total_revenues}</strong> and <strong>{total_plays}</strong> plays over the next 12 weeks.</p>
                                                <p>Total Revenues: <strong>${total_revenues}</strong></p>
                                                <p>Total Plays: <strong>{total_plays}</strong></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                : null}
                        </div>
                        <div className="col-lg-3 col-md-1"></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Predict;