import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Link, BrowserRouter as Router } from "react-router-dom"
import { Navbar, Nav, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import AuthHelperMethods from '../AuthHelperMethods';
import './main.css';
class NavbarComp extends Component {

    constructor(props) {
        super(props)
        this.Auth = new AuthHelperMethods();
        this.token = this.Auth.getToken()
        
    }

    logout = () => {
        this.Auth.logout();
        window.location.reload();
    }

    redirectToProfile = () => {
        const userDetails = this.Auth.getTokenData()
        this.props.history.push({
            pathname: `/profile/${userDetails.username}`
        })
    }

    loginArea = () => {
        if (this.token === null) {
            return (
                <div className="login">
                    <div className="login-btn"> 
                        <Link  to="/login"><Button  >Login</Button></Link>
                    </div>
                    &nbsp;
                    &nbsp;
                <div className="logout-btn">
                    <Link to="/signup">
                        <Button className="logout-btn" >Sign Up</Button>
                    </Link>
                </div>
                </div>
            )
        } else {
            let tokenData = this.Auth.getTokenData();

            console.log(tokenData)
            return (
                <DropdownButton id="dropdown-basic-button" title={tokenData.name} variant="light" >
                    <Dropdown.Item onClick={this.redirectToProfile}>Profile</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={this.logout}>
                        <p style={{ color: "red", marginBottom: "0px" }}>Logout</p>
                    </Dropdown.Item>
                </DropdownButton >
            )
        }
    }

    render() {
        return (
             <div className="navbar-container">
                <Navbar bg="primary" expand="lg"sticky="top" >
                    <Navbar.Brand href="/">
                        <h1 className="logo">
                            CrowdFund
                        </h1>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link  href="/explore">Explore</Nav.Link>
                            <Nav.Link  href="/start">Start a Project</Nav.Link>
                        </Nav>
                        {this.loginArea()}
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
};

export default withRouter(NavbarComp);