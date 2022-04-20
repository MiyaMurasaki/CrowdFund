import React, { Component } from 'react';
import axios from 'axios';
import { Link, BrowserRouter as Router, Switch, Route, withRouter } from "react-router-dom"
import { Container, Row, Col, Button, ProgressBar, Tab, Tabs, Form, Card } from 'react-bootstrap';
import AuthHelperMethods from '../AuthHelperMethods';
import NavbarComp from '../NavBar/NavBar'
import './DisplayProjectDetailsPage.css'
import img1 from '../../images/img1.jpg'
import img2 from '../../images/img2.jpg'
import img3 from '../../images/img3.jpg'
import img4 from '../../images/img4.jpg'
import img5 from '../../images/img5.jpg'


var moment = require('moment-timezone');
const images = [img1,img2,img3,img4,img5]


const Divider = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 0.1
        }}
    />
);

const noProjectAbout = 'The creator hasn\'t provided a detailed description of this project.'

class DisplayProjectDetailsPage extends Component {
    Auth = new AuthHelperMethods()

    constructor(props) {
        super(props);
        this.state = {
            projectData: null,
            follows: false,
            hasFunded: false,
            validComment: false,
            comment: '',
            projectComments: [],
            projectBenefits: []
        }
    }

    handleUserInput = (e) => {
        e.preventDefault()
        const name = e.target.name;
        const value = e.target.value;
        this.setState({ [name]: value });
    }

    submitComment = () => {
        console.log('sending comment')
        let details = this.state.projectData

        let postData = {
            commentor: this.Auth.getTokenData().username,
            creator: details.username,
            orgname: details.orgname,
            teamname: details.teamname,
            projname: details.projname,
            comment: this.state.comment
        }
        axios.post('https://crowdfunding-2102.herokuapp.com/api/v1/comment', postData)
            .then(response => {
                console.log(response.data);
                window.location.reload()
                // setTimeout(() => {
                //     window.location.reload()
                // }, 2000);
                // window.location.reload()
                // this.props.history.push(`/projects/${details.username}/${details.orgname}/${details.teamname}/${details.projname}`)
            })
            .catch(error => {
                console.log(error.response.data);
                alert(error.response.data)
            })
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(this.state);
        if (JSON.stringify(prevState) !== JSON.stringify(this.state)) {
            const { comment } = this.state
            let isInvalid = comment == ''
            this.setState({
                validComment: !isInvalid
            })
        }
    }

    async componentDidMount() {
        console.log('back here at display project page')
        if (!this.Auth.loggedIn()) { return }
        let curUser = this.Auth.getTokenData().username;
        const { username, orgName, teamName, projName } = this.props.match.params


        axios.get(`https://crowdfunding-2102.herokuapp.com/api/v1/user/${curUser}`)
            .then(response => {
                let data = response.data
                console.log('user data:')
                console.log(data.followed);

                let found = false
                let hasFunded = false
                data.followed.forEach(proj => {
                    if (proj.creator === username
                        && proj.orgname === orgName && proj.teamname === teamName && proj.projname === projName) {
                        found = true
                    }
                })
                data.backed.forEach(proj => {
                    if (proj.creator === username
                        && proj.orgname === orgName && proj.teamname === teamName && proj.projname === projName) {
                        hasFunded = true
                    }
                })
                if (found) {
                    console.log('Setting follows to true');
                    this.setState({
                        follows: found
                    })
                }
                if (hasFunded) {
                    console.log('Setting hasFunded to true');
                    this.setState({
                        hasFunded: hasFunded
                    })
                }
            })

        console.log(`https://crowdfunding-2102.herokuapp.com/api/v1/projects/${username}/${orgName}/${teamName}/${projName}`);

        var postData = null
        axios.get(`https://crowdfunding-2102.herokuapp.com/api/v1/projects/${username}/${orgName}/${teamName}/${projName}`)
            .then((response) => {
                console.log((response.data));
                let data = response.data;
                let daysToDeadline = this.getDaysToDeadline(data)
                if (daysToDeadline <= 0 && data.status === 'In Progress') {
                    console.log('changing status');
                    if (data.curfunds < data.goal) {
                        data.status = 'Abandoned'
                    } else {
                        data.status = 'Complete'
                    }
                    // set the status
                    postData = {
                        username: username,
                        orgname: orgName,
                        teamname: teamName,
                        projname: projName,
                        status: data.status
                    }
                }
                console.log(data.status);
                this.setState({
                    projectData: data
                })
                if (postData !== null) {
                    return axios.post(`https://crowdfunding-2102.herokuapp.com/api/v1/setStatus`, postData)
                }
            })
            .then(response => {
                console.log('status changed');
            })
            .catch(error => {
                alert(error)
            })

        axios.get(`https://crowdfunding-2102.herokuapp.com/api/v1/comments/${username}/${orgName}/${teamName}/${projName}`)
            .then(response => {
                let comments = response.data
                this.setState({
                    projectComments: comments
                })
            })
            .catch(error => {
                alert(error)
            })

        axios.get(`https://crowdfunding-2102.herokuapp.com/api/v1/benefits/${username}/${orgName}/${teamName}/${projName}`)
            .then(response => {
                let benefits = response.data
                this.setState({
                    projectBenefits: benefits
                })
            })
            .catch(error => {
                alert(error)
            })
    }

    followUnfollowProject = () => {
        let data = this.state.projectData;
        let curUser = this.Auth.getTokenData().username;
        if (this.state.follows) {
            axios.delete(`https://crowdfunding-2102.herokuapp.com/api/v1/follow/${curUser}/${data.username}/${data.orgname}/${data.teamname}/${data.projname}`)
                .then(response => {
                    console.log('unfollowed');
                    let curState = this.state.follows
                    this.setState({
                        follows: !curState
                    })
                })
                .catch(error => {
                    console.log('error');
                })
        } else {
            let postData = {
                follower: curUser,
                creator: data.username,
                orgname: data.orgname,
                teamname: data.teamname,
                projname: data.projname
            }
            axios.post('https://crowdfunding-2102.herokuapp.com/api/v1/follow', postData)
                .then(response => {
                    console.log('followed');
                    let curState = this.state.follows
                    this.setState({
                        follows: !curState
                    })
                })
                .catch(error => {
                    console.log('error');
                })
        }
    }

    withdrawFunding = () => {
        let data = this.state.projectData;
        let curUser = this.Auth.getTokenData().username;
        let postData = {
            backer: curUser,
            creator: data.username,
            orgname: data.orgname,
            teamname: data.teamname,
            projname: data.projname
        }
        axios.post(`https://crowdfunding-2102.herokuapp.com/api/v1/withdraw`, postData)
            .then(response => {
                console.log(response.data);
                console.log(response.data.amount);
                alert(`You have withdrawn S$ ${response.data.amount} from this project`)

                setTimeout(() => {
                    window.location.reload()
                }, 1000)

            })
            .catch(error => {
                alert(`Error!`)
            })
    }

    renderFollowButton = (details) => {
        let curUser = this.Auth.getTokenData().username;
        let renderText = "Follow"
        if (this.state.follows) {
            renderText = "Unfollow"
        }
        console.log(curUser);
        console.log(details.username);

        if (curUser === details.username) {
            return null;
        } else {
            return (
                <Button style={{ width: "100%", border: "1px solid black", marginTop: "2%" }} variant="Light" onClick={this.followUnfollowProject}>
                    {renderText}
                </Button>
            )
        }
    }

    renderWithdrawButton = (details) => {
        let curUser = this.Auth.getTokenData().username;
        let renderText = "Withdraw Funding"
        if (!this.state.hasFunded) {
            return null;
        }
        return (
            <Button style={{ width: "100%", marginTop: "2%" }} variant="danger" onClick={this.withdrawFunding}>
                {renderText}
            </Button>
        )
    }

    renderDeleteComment = (commentObj) => {
        if (commentObj.commentor === this.Auth.getTokenData().username) {
            return (<Button variant="danger" onClick={() => this.deleteComment(commentObj)}>
                Delete
            </Button>)
        }
    }

    deleteComment = (commentObj) => {
        axios.delete(`https://crowdfunding-2102.herokuapp.com/api/v1/comment/${commentObj.commentor}/${commentObj.timestamp}`)
            .then(response => {
                console.log(response.data);
                window.location.reload()
            })
            .catch(error => {
                alert(error.response.data)
            })
    }

    renderComments = () => {
        let comments = this.state.projectComments;
        return (
            <div style={{ marginTop: "2%" }}>
                {
                    comments.map((commentObj, index) => {
                        const datetime = moment(moment.unix(commentObj.timestamp).toDate()).format('MMM Do YYYY, hh:mm a')
                        console.log(datetime);

                        return <Card style={{ marginTop: "1%" }} key={index}>
                            <Card.Body>
                                <Card.Title>@{commentObj.commentor}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{datetime}</Card.Subtitle>
                                <Card.Body>
                                    {commentObj.comment}
                                </Card.Body>
                                {this.renderDeleteComment(commentObj)}
                            </Card.Body>
                        </Card>
                    })
                }
            </div>
        )
    }

    renderBenefits = () => {
        let benefits = this.state.projectBenefits;
        return (
            <div style={{ marginTop: "2%" }}>
                {
                    benefits.map((benefitObj, index) => {
                        return <Card style={{ marginTop: "1%" }} key={index}>
                            <Card.Body>
                                <Card.Title>Pledge above S$ {benefitObj.minamount}</Card.Title>
                                <Card.Text>
                                    Benefit: {benefitObj.benefit}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    })
                }
            </div>
        )
    }

    redirectToFundPage = () => {
        const details = this.state.projectData
        details.backerName = this.Auth.getTokenData().name;
        details.backerUsername = this.Auth.getTokenData().username;
        this.props.history.push({
            pathname: `/fund/${details.username}/${details.orgname}/${details.teamname}/${details.projname}`,
            state: { data: details }
        })
    }

    getDaysToDeadline = (details) => {
        let currentDateString = moment().get('year') + "-" + (moment().get('month') + 1) + "-" + moment().get('date');
        let currentDateObj = moment(currentDateString).tz("Asia/Singapore")

        var deadlineObj = moment(details.deadline).tz("Asia/Singapore")
        console.log('herererererer')
        console.log(`days: ${Math.floor(moment.duration(deadlineObj.diff(currentDateObj)).asDays())}`);

        return Math.floor(moment.duration(deadlineObj.diff(currentDateObj)).asDays());
    }

    redirectToEditPage = (details) => {
        this.props.history.push({
            pathname: `/editproject/${details.username}/${details.orgname}/${details.teamname}/${details.projname}`,
            // state: { data: details }
        })
    }

    renderEditProject = (details) => {
        let curUser = this.Auth.getTokenData().username
        if (details.username !== curUser) {
            return null
        }
        return <Button style={{ width: "100%" }} variant="primary" onClick={() => this.redirectToEditPage(details)}>
            Edit Project
        </Button>
    }

    renderBackOrStatus = (details) => {
        console.log(details.status);

        if (details.status === 'In Progress') {
            return (
                <div>
                    <div className="div-stats">
                        <h3 className="generic-h3-stats">{this.getDaysToDeadline(details)} </h3>
                        <p className="generic-p-stats">day{this.getDaysToDeadline(details) > 1 ? 's' : null} to go</p>
                    </div>

                    {this.renderEditProject(details)}
                    <Button style={{ width: "100%", marginTop: "2%" }} variant="success" type="submit" onClick={this.redirectToFundPage}>
                        Back this project
                    </Button>
                    {this.renderWithdrawButton(details)}
                    {this.renderFollowButton(details)}
                </div>
            )
        } else if (details.status === 'Complete') {
            return (
                <div>
                    <h3 className="h3-complete">Project Funding Complete!</h3>
                </div>
            )
        } else {

            return (
                <div>
                    <h3 className="h3-abandoned">Project Funding Abandoned!</h3>
                </div>
            )
        }
    }

    renderProjectData = () => {
        if (this.state.projectData == null || Object.keys(this.state.projectData).length == 0) {
            return null;
        }
        let details = this.state.projectData;
        let randomImage = Math.floor(Math.random() * 3)
        return (
            <div style={{ marginTop: "1%" }}>
                <div style={{ textAlign: "center" }}>
                    <h2>{details.projname}</h2>
                    <h5>{details.description}</h5>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignContent: "center" }}>
                        <h6>Creator: @{details.username}</h6>
                        &nbsp;
                        &nbsp;
                        <h6>Org: {details.orgname === '$Independent$' ? `Independent` : details.orgname}</h6>
                        &nbsp;
                        &nbsp;
                        <h6>Team: {details.teamname}</h6>
                        &nbsp;
                        &nbsp;
                        <h6>Category: {details.categories}</h6>
                    </div>
                </div>
                <Container style={{ marginTop: "3%" }}>
                    <Row>
                        <Col >
                            <img className="custom"
                                src={images[randomImage]}
                                alt="img"
                                style={{ width: 750, height: 450 }}
                            />
                        </Col>
                        <Col>
                            <ProgressBar variant="success" now={(details.curfunds / details.goal) * 100} />
                            <div>
                                <div style={{ marginBottom: "3%" }}>
                                    <div className="div-stats">
                                        <h3 className="curfunds">S$ {details.curfunds} </h3>
                                        <p className="goal">pledged of S$ {details.goal} goal </p>
                                    </div>

                                    <div className="div-stats">
                                        <h3 className="generic-h3-stats">{details.numbackers} </h3>
                                        <p className="generic-p-stats">backer{details.numbackers > 1 ? 's' : null} </p>
                                    </div>
                                    {this.renderBackOrStatus(details)}
                                </div>
                                <div style={{ marginTop: "2%" }}>
                                    <p className="p-fineprint">
                                        All or nothing funding. This project will only be funded if it reaches its goal by {moment(details.deadline).format("dddd, MMMM Do YYYY")} 0000 hrs SGT.
                                    </p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>

                <Container style={{marginBottom:"5%"}}>
                    <Row>
                        <Col>
                            <Divider color="gray" />
                            <Tabs defaultActiveKey="details" id="uncontrolled-tab-example">
                                <Tab eventKey="about" title="About">
                                    {/* <div style ={{textAlign: "center"}}><h4>Hi</h4></div> */}
                                    <div style={{ marginTop: "3%" }}>
                                        <p>{this.state.projectData.about === null ? noProjectAbout : this.state.projectData.about}</p>
                                    </div>
                                </Tab>
                                <Tab eventKey="benefits" title="Benefits">
                                    {this.renderBenefits()}
                                </Tab>
                                <Tab eventKey="comments" title="Comments">
                                    <div style={{ marginTop: "2%", display: 'flex', flexDirection: "column" }}>
                                        <Form>
                                            <Form.Group >
                                                <Form.Control as="textarea" rows="3" name="comment" onChange={(event) => this.handleUserInput(event)}
                                                    placeholder="Type your comment here." />
                                            </Form.Group>
                                            <Button style={{ justifyItems: "center" }} variant="dark" onClick={() => this.submitComment()} disabled={!this.state.validComment}>
                                                Comment
                                            </Button>
                                        </Form>
                                        {this.renderComments()}
                                    </div>
                                    {/* {this.renderProjects(data, 'followed')} */}
                                </Tab>
                            </Tabs>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }

    render() {
        if (!this.Auth.loggedIn()) {
            console.log('redirecting to login page');

            const { username, orgName, teamName, projName } = this.props.match.params
            this.props.history.push({
                pathname: '/login',
                state: { redirectUrl: `/projects/${username}/${orgName}/${teamName}/${projName}` }
            })
        }
        return (
            <div>
                <NavbarComp />
                {this.renderProjectData()}
            </div>

        )
    }
}

export default withRouter(DisplayProjectDetailsPage)