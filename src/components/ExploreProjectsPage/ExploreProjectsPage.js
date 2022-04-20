import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom'
import { Link, BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { Tab, Tabs, Container, Row, Col, ListGroup } from 'react-bootstrap';
import AuthHelperMethods from '../AuthHelperMethods';
import NavbarComp from '../NavBar/NavBar'

class ExploreProjectsPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            projectData: [],
            hasSearchedSomething: false,
            searchString: ''
        }
    }

    componentDidMount() {
        const locationState = this.props.location.state
        let searchString = null
        if (locationState !== undefined) {
            searchString = locationState.searchString
            console.log(`search for projects containing ${searchString}`)
        }
        if (searchString === undefined || searchString === null) {
            axios.get('https://crowdfunding-2102.herokuapp.com/api/v1/allProjects')
                .then(response => {
                    console.log(response.data);
                    this.setState({
                        projectData: response.data
                    })
                })
                .catch(error => {
                    alert(error)
                })
        } else {
            axios.get(`https://crowdfunding-2102.herokuapp.com/api/v1/searchProjects/${searchString}`)
                .then(response => {
                    console.log(response.data)
                    this.setState({
                        projectData: response.data,
                        hasSearchedSomething: true,
                        searchString: searchString
                    })
                })
                .catch(error => {
                    alert(error)
                })
        }
    }

    renderProjectList = (details) => {
        let renderText = "There are no projects to see."
        if (details.length === 0 && this.state.hasSearchedSomething) {
            renderText = `We couldn't find any projects containing the keyphrase "${this.state.searchString}".`
        }

        if (details.length === 0) {
            var link = <a href="/start">here</a>;
            return (
                // <div style={{ display: 'flex', marginTop: "5%", flexDirection: "column ", justifyContent: 'center', alignContent: "center" }}>
                <div style={{ textAlign: "center", marginTop: "5%"}}>
                    <div>
                        <h4>{renderText} </h4>
                    </div>
                    <div>
                        <h4>Click {link} to start a new project!</h4>
                    </div>
                </div>
            )
        }
        return (
            <div style={{ marginTop: "3%" }}>
                <div style={{ marginLeft: "20px" }}>
                    <h3>Projects: </h3>
                </div>
                {/* <ol>
                    {
                        details.map((proj, index) => {
                            return <li key={index}>
                                <div>
                                    <Link to={`/projects/${proj.username}/${proj.orgname}/${proj.teamname}/${proj.projname}`} >
                                        {proj.projname}
                                    </Link>
                                    <h6>{proj.description}</h6>
                                    <h6>Creator: {proj.username} </h6>
                                    <h6>Org: {proj.orgname === '$Independent$'? 'Independent': proj.orgname} </h6>
                                    <h6>Category: {proj.categories}</h6>
                                </div>
                            </li>
                        })
                    }
                </ol> */}
                <ListGroup>
                    {
                        details.map((proj, index) => {
                            return <ListGroup.Item key={index}>
                                <div>
                                    <Link to={`/projects/${proj.username}/${proj.orgname}/${proj.teamname}/${proj.projname}`} >
                                        {proj.projname}
                                    </Link>
                                    <h6>{proj.description}</h6>
                                    <h6>Creator: @{proj.username} </h6>
                                    <h6>Org: {proj.orgname === '$Independent$' ? 'Independent' : proj.orgname} </h6>
                                    <h6>Category: {proj.categories}</h6>
                                </div>
                            </ListGroup.Item>
                        })
                    }
                </ListGroup>
            </div>
        )
    }

    render() {
        let details = this.state.projectData
        return (
            <div>
                <NavbarComp />
                {this.renderProjectList(details)}
            </div>
        )
    }
}

export default withRouter(ExploreProjectsPage)