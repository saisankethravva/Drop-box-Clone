import React, { PureComponent } from 'react'
//import { useDropzone } from 'react-dropzone'
import { dataService } from '../services/dataService';
import { Card, Button } from 'react-bootstrap';
var jwt = require('jsonwebtoken');
// rfc
const inputFileButton = {
    marginLeft: "20px",
    backgroundColor: "#4CAF50",
    border: "none",
    color: "white",
    margin: "4px 2px",
    cursor: "pointer",
}

class FileUpload extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            files: [],
            descr: "",
            result: ""
        }
        this.uploadFile = this.uploadFile.bind(this);
    }

    uploadFile() {
        const userData = this.props.user
        console.log(`userData: ${userData}`);
        const files = this.state.files;
        if (files.length > 0) {
            dataService.uploadFile(files[0], userData, this.state.descr)
                .then(json => {
                    console.log(json);
                    this.setState({
                        result: "File Uploaded successfully"
                    }); 
                    setTimeout(()=> {
                        if (this.props.isAdmin){
                            this.props.refreshList();
                        } else {
                            this.props.refreshList2(userData);
                        } 
                    }, 500);

                })
                .catch(reason => {
                    console.log(reason);
                    this.props.refreshList();
                });
        }
    }

    render() {
        return (
            <div>
                <Card className="text-center" style={{ margin: '5rem 10rem 2rem 10rem'}} >
                    <Card.Header> File Upload Result: {this.state.result} </Card.Header>
                    <Card.Body>
                        <input type="file" style={{"marginLeft": "20px"}} onChange={e => this.setState({
                            files: e.target.files
                        })}> 
                        </input>
                       <a  style={{"marginLeft": "40px"}}> 
                       <input
                            value={this.state.desc}
                            onChange={e => this.setState({
                                descr: e.target.value
                            })}
                            placeholder="Description"
                            type="text"
                            name="Description"
                        />
                        &nbsp; &nbsp;
                        <Button onClick={this.uploadFile} style={{"padding": "5px"}}>Upload</Button>
                       </a>
                        
                    </Card.Body>
                </Card>

            </div>
        )
    }
}

export default FileUpload