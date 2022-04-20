import React, { Component } from 'react';
import axios from 'axios';
import { Link, BrowserRouter as Router, Switch, Route, withRouter } from "react-router-dom"
import { Container, Row, Col, Button, ProgressBar, Tab, Tabs, Form, Card } from 'react-bootstrap';
import AuthHelperMethods from '../AuthHelperMethods';
import NavbarComp from '../NavBar/NavBar'
var moment = require('moment-timezone');

class EditProjectDetailsPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            projectData: null,
            isValidAbout: false,
            about: ''
        }
    }

    componentDidMount() {
        const { username, orgname, teamname, projname } = this.props.match.params
        console.log(this.props.match.params);

        let details = {
            username: username,
            orgname: orgname,
            teamname: teamname,
            projname: projname
        }
        this.setState({
            projectData: details
        })
    }

    handleUserInput = (e) => {
        e.preventDefault()
        const name = e.target.name;
        const value = e.target.value;
        console.log(`output: ${name} ${value}`);
        this.setState({ [name]: value });
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(this.state);
        if (JSON.stringify(prevState) !== JSON.stringify(this.state)) {
            const { about } = this.state
            let isValid = !(about === '')
            this.setState({
                isValidAbout: isValid
            })
        }
    }

    redirectToHome = () => {
        console.log('redirecting to home')
        this.props.history.push('/')
    }

    deleteProject = (details) => {
        axios.delete(`https://crowdfunding-2102.herokuapp.com/api/v1/project/${details.username}/${details.orgname}/${details.teamname}/${details.projname}`)
            .then(response => {
                alert('Project deleted. Redirecting you to the home page')
                this.redirectToHome()
            })
            .catch(error => {
                alert(error)
            })
    }

    editProject = () => {
        let details = this.state.projectData;
        let postData = {
            username: details.username,
            orgname: details.orgname,
            teamname: details.teamname,
            projname: details.projname,
            about: this.state.about
        }
        axios.post('https://crowdfunding-2102.herokuapp.com/api/v1/editProject', postData)
            .then(response => {
                console.log('updated!');
                alert('Project edited. Redirecting you to the project details page')
                this.props.history.push(`/projects/${details.username}/${details.orgname}/${details.teamname}/${details.projname}`)
                // this.props.history.push('/')
            })
            .catch(error => {
                alert(error)
            })
    }

    render() {
        let details = this.state.projectData
        if (details === null) {
            return null;
        }
        return (
            <div>
                <NavbarComp />
                <h2 style={{ marginTop: "2%", textAlign: "center", fontFamily: "courier" }}> Edit '{this.state.projectData.projname}'</h2>
                <Container>
                    <Row>
                        <Col></Col>
                        <Col xs={7}>
                            <Form>
                                <Form.Group >
                                    <Form.Label>About</Form.Label>
                                    <Form.Control as="textarea" rows="5" name="about" onChange={(event) => this.handleUserInput(event)}
                                        placeholder="Talk more about your project (eg. the inspiration, the obstacles, and the novel idea)" />
                                </Form.Group>
                                <div style={{ textAlign: "center" }}>
                                    <Button style={{ justifyItems: "center" }} variant="success" onClick={this.editProject} disabled={!this.state.isValidAbout}>
                                        Save
                                    </Button>
                                    <Button style={{ justifyItems: "center", marginLeft: "2%" }} variant="danger" onClick={() => this.deleteProject(details)}>
                                        Delete Project
                                    </Button>
                                </div>
                            </Form>
                            <div style={{ textAlign: "center" }}>
                                <Button style={{ justifyItems: "center", marginTop: "5%" }} variant="link" onClick={() => this.redirectToHome()}>
                                    Back to Home
                                </Button>
                            </div>

                        </Col>
                        <Col></Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default withRouter(EditProjectDetailsPage)