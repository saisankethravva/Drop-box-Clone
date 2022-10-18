import React, { PureComponent } from 'react'
import { Button, Navbar, Table } from "react-bootstrap";
import { dataService } from '../services/dataService';
import FileUpload from './FileUpload';
import LogOut from './LogOut';
import LogInPage from './LogInPage';
var jwt = require('jsonwebtoken');


class UserPage extends PureComponent {
    constructor(props) {
        super(props)

        const sessionToken = sessionStorage.getItem("token")
        // JWT DECODE 
        // Store decoded jwt in session storage

        this.state = {
            userDataDynamo: [],
            userData: undefined,
            desc: "",
            isAdmin: false
        }
        this.setDescription = this.setDescription.bind(this)
        this.updateTable = this.updateTable.bind(this)
    }

    setDescription(d) {
        this.setState({
            desc: d
        })
    }

    updateTable2(user) {
        console.log("Called Update Table");
        dataService.getUserData(user)
            .then(json => {
                console.log(json);
                if (Array.isArray(json)) {
                    this.setState({
                        userDataDynamo: json
                    });
                }
            })
            .catch(reason => {
                console.log("Failed to fetch data from server, reason is : ", reason);
            });
    }
    updateTable() {
        console.log("Called Update Table");
        dataService.getAdminData()
            .then(json => {
                console.log(json);
                if (Array.isArray(json)) {
                    this.setState({
                        userDataDynamo: json
                    });
                }
            })
            .catch(reason => {
                console.log("Failed to fetch data from server, reason is : ", reason);
            });
    }
    componentDidMount() {
        console.log("sessionStorage");
        var token = sessionStorage.getItem("token");
        console.log(token);
        var decoded = jwt.decode(token);
        // get the decoded payload and header
        var decoded = jwt.decode(token, { complete: true });
        console.log(decoded.header);
        console.log(decoded.payload);
        const userObj = decoded.payload;
        this.setState({
            userData: userObj
        })
        const isAdmin = userObj && userObj["cognito:groups"] && userObj["cognito:groups"].filter(g => g == "admin").length > 0;

        this.setState({ isAdmin });
        setTimeout(()=> {
            console.log("UserEmailCheckBefore:"+this.state.userData.email)
            console.log("isAdmin:"+this.state.isAdmin)
            if (this.state.isAdmin){
                this.updateTable()
            } else {
                this.updateTable2(this.state.userData.email);
            }
        }, 500);
        
      
        dataService.getUser()
    }
    

    onClickDownLoad(file) {
        window.open("https://d3ap8en199dpxn.cloudfront.net/" + file);
    }

    onClickDelete(fileName, id) {
        dataService.deleteFile(fileName, id)
            .then(json => {
                console.log(json);
                setTimeout(()=> {
                if (this.state.isAdmin){
                    this.updateTable()
                } else {
                    this.updateTable2(this.state.userData.email);
                }
            }, 300);
                
            })
            .catch(reason => {
                console.log("Failed to delete, reason is : ", reason);
            });
    }

    // fetchListAgain




    render() {

        const { isAdmin } = this.state;

        return (

            <div>
                <h1>Anil</h1>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand>Sanketh-Cloud</Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            Signed in as: {this.state.userData &&
                                <a href="#login">{this.state.userData.email}</a>}
                            &nbsp;&nbsp;
                            User Type: {
                                isAdmin && <a> "Administrator" </a>
                            }
                            {
                                !isAdmin && <a> "User (Non Admin)"</a>
                            }
                        </Navbar.Text>
                    </Navbar.Collapse>
                    {this.state.userData && <LogOut></LogOut>}
                    {!this.state.userData && <LogInPage></LogInPage>}
                </Navbar>
                {
                    this.state.userData &&
                    <FileUpload
                        user={this.state.userData.email}
                        desc={this.state.desc}
                        refreshList={e => this.updateTable()}
                        refreshList2={e => this.updateTable2(e)}
                        isAdmin={isAdmin}
                    >
                    </FileUpload>
                }


                <div style={{ "margin": "50px" }}>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr key={0}>
                                {
                                    isAdmin &&
                                    <th>User Name</th>
                                }

                                <th>File Name</th>
                                <th>Description</th>
                                <th>File Upload Time</th>
                                <th>File Updated Time</th>
                                <th>Download</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.userDataDynamo.map(item => {
                                    return (
                                        <tr key={item.userId}>
                                            {
                                                isAdmin &&
                                                <td>{item.userName}</td>
                                            }

                                            <td>{item.fileName}</td>
                                            <td>{item.description}</td>
                                            <td>{new Date(item.fileCreatedTime).toLocaleString()}</td>
                                            <td>{new Date(item.fileUpdatedTime).toLocaleString()}</td>
                                            <td><Button variant="outline-success" onClick={event => this.onClickDownLoad(item.fileName)}>
                                                <a href={"https://d3k2ba7dd5osnx.cloudfront.net/" + item.fileName} target="_blank" download={item.fileName}>DownLoad</a>
                                            </Button></td>
                                            <td><Button variant="outline-danger" onClick={event => this.onClickDelete(item.fileName, item.userId)}>
                                                Delete
                                            </Button></td>
                                        </tr>

                                    );
                                })
                            }

                        </tbody>
                    </Table>
                </div>

            </div>

        )
    }
}

export default UserPage