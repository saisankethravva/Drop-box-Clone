import React from 'react'
import { Button, Navbar, Card } from "react-bootstrap";
import { useRouteMatch } from 'react-router-dom';

// rfc
function LogInPage() {
    let { path, url, location } = useRouteMatch();
    console.log(location);
    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand>DropBucket</Navbar.Brand>
            </Navbar>

            <Card style={{ width: '18rem', margin: "100px", justifyContent: "center"}}>
                <Card.Header>Welcome to the DropBucket App</Card.Header>
                <Card.Body>
                    <Card.Text></Card.Text>
                    <Button  variant="primary" href="https://sanketh-dropbox.auth.us-west-1.amazoncognito.com/login?client_id=l5qirgu7eubs9btbr0s4o7e7t&response_type=token&scope=phone+email+openid+aws.cognito.signin.user.admin+profile&redirect_uri=http://localhost:3000/">
                        LogIn / SignUp  { <a href="https://sanketh-dropbox.auth.us-west-1.amazoncognito.com/login?client_id=l5qirgu7eubs9btbr0s4o7e7t&response_type=token&scope=phone+email+openid+aws.cognito.signin.user.admin+profile&redirect_uri=http://localhost:3000/"> LOGIN</a> }
                    </Button>
                </Card.Body>
            </Card>

        </div>

    )
}

export default LogInPage
