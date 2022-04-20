import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom'
import { Link, BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { Container, Row, Col, Button, Form, FormGroup } from 'react-bootstrap';
import AuthHelperMethods from '../AuthHelperMethods';
import NavbarComp from '../NavBar/NavBar'


class FundProjectPage extends Component {
    Auth = new AuthHelperMethods()
    constructor(props) {
        super(props)
        this.state = {
            projectData: null,
            amount: 0,
            disabled: true,
            pledgeSuccessful: false
        }
    }

    componentDidMount() {
        const details = this.props.location.state.data
        console.log("at the funding page!!")
        console.log(details)
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

    backProject = () => {
        let data = {
            amount: parseInt(this.state.amount),
            backer: this.state.projectData.backerUsername,
            creator: this.state.projectData.username,
            orgname: this.state.projectData.orgname,
            teamname: this.state.projectData.teamname,
            projname: this.state.projectData.projname
        }

        axios.post('https://crowdfunding-2102.herokuapp.com/api/v1/fund', data)
            .then(response => {
                let details = this.state.projectData
                console.log(response)
                console.log('success!!')
                this.setState({
                    pledgeSuccessful: true
                })

                setTimeout(() => {
                    this.props.history.push({
                        pathname: `/projects/${details.username}/${details.orgname}/${details.teamname}/${details.projname}`
                    })
                }, 3000)


            })
            .catch(error => {
                console.log(error)
                console.log('error!!')
            })
    }

    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(prevState) !== JSON.stringify(this.state)) {
            const { amount } = this.state
            let isValidAmount = parseInt(amount) > 0 ? true : false;
            this.setState({
                disabled: !isValidAmount
            })
        }
    }

    renderOptionOrText = (details) => {
        if (this.state.pledgeSuccessful) {
            return (
                <div style={{ marginTop: "2%", display: 'flex', flexDirection:'column', justifyContent: 'center', textAlign: 'center'}}>
                    <div style={{display: 'inline-block'}}>
                        <h5>Thank you for your generosity, {details.backerName}!</h5>
                    </div>
                    <div style={{display: 'inline-block'}}>
                        <p>Redirecting you to the {details.projname} project page...</p>
                    </div>
                </div>


            )
        } else {
            return (
                <div style={{ marginTop: "2%", display: 'flex', justifyContent: 'center' }}>
                    <Form>
                        <FormGroup role="form">
                            <Form.Group>
                                <Form.Control type="number" placeholder="Pledge Amount (S$)" name="amount" onChange={this.handleUserInput} />
                            </Form.Group>
                        </FormGroup>
                    </Form>
                    <Button style={{ marginLeft: "1%", height: "40%" }} variant="success" disabled={this.state.disabled} onClick={this.backProject}>
                        Pledge
                    </Button>
                </div>
            )
        }

    }

    renderFundProjectPage = (details) => {
        return (
            <div style={{ marginTop: "1%" }}>
                <div style={{ textAlign: "center" }}>
                    <h2>{details.projname}</h2>
                    <h5>{details.description}</h5>
                </div>
                {this.renderOptionOrText(details)}

            </div>)
    }

    render() {
        if (!this.Auth.loggedIn()) {
            if (this.state.projectData !== null || this.state.projectData !== undefined) {
                const details = this.state.projectData
                this.props.history.push({
                    pathname: '/login',
                    state: { redirectUrl: `/fund/${details.username}/${details.orgname}/${details.teamname}/${details.projname}` }
                })
            }
        }
        let details = this.state.projectData;
        return (
            <div>
                <NavbarComp />
                {(details == null || Object.keys(details).length == 0) ? null : this.renderFundProjectPage(details)}

            </div>
        )
    }
}

export default withRouter(FundProjectPage)