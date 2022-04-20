import React, { Component } from 'react';
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { Link, BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { Tooltip, OverlayTrigger, Carousel, Form, FormControl, Button } from 'react-bootstrap';
import './HomePage.css'
import NavbarComp from '../NavBar/NavBar'
import img1 from '../../images/img1.jpg'
import img2 from '../../images/img2.jpg'
import img3 from '../../images/img3.jpg'
import img4 from '../../images/img4.jpg'
import img5 from '../../images/img5.jpg'


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

class HomePage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            featuredProjects: [],
            search: '',
            validSearch: false
        }
    }

    componentDidMount() {
        // axios.get('https://crowdfunding-2102.herokuapp.com/api/v1/getFeaturedProjects')
        axios.get('https://crowdfunding-2102.herokuapp.com/api/v1/getFeaturedProjects')
            .then(response => {
                let data = response.data
                console.log(data)
                this.setState({
                    featuredProjects: data
                })
            })
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(this.state);
        if (JSON.stringify(prevState) !== JSON.stringify(this.state)) {
            const { search } = this.state
            let isValid = !(search === '')
            this.setState({
                validSearch: isValid
            })
        }
    }

    handleUserInput = (e) => {
        e.preventDefault()
        const name = e.target.name;
        const value = e.target.value;
        console.log(`output: ${name} ${value}`);
        this.setState({ [name]: value });
    }

    submitSearch = () => {
        const { search } = this.state
        this.props.history.push({
            pathname: `/explore`,
            state: { searchString: search }
        })
    }

    renderCarousel = (projects) => {
        console.log('rendering carousel');
        console.log(projects.length);
        let carouselItems = projects.map((project, index) => {
            let randomImage = Math.floor(Math.random() * 3)
            console.log(randomImage);
            return (
                <Carousel.Item key={index}>
                    <Link  to={`/projects/${project.username}/${project.orgname}/${project.teamname}/${project.projname}`}>
                        <img className="custom"
                            src={images[randomImage]}
                            alt="img"
                            style={{ width: 850, height: 500 }}
                        />
                        <Carousel.Caption >
                            <div className="caption-container">
                            <h3>{project.projname}</h3>
                            <p>{project.description}</p>
                            </div>
                        </Carousel.Caption>
                    </Link>
                </Carousel.Item>
            )
        })
        return (
            <Carousel>
                {carouselItems}
            </Carousel >
        )
    }

    render() {
        let projects = this.state.featuredProjects
        return (
            <div>
                <NavbarComp />
                <div style={{ display: 'flex', justifyContent: 'center', margin: "10px" }}>
                    <Form inline style={{ textAlign: "center" }} onSubmit={this.submitSearch}>
                        <FormControl type="text" placeholder="Search" name="search" className="mr-sm-2" onChange={(event) => this.handleUserInput(event)}/>
                        <Button variant="outline-success"  type="submit" disabled={!this.state.validSearch}>Search</Button>
                    </Form>
                </div>
                <Divider color="gray" />
                <div style={{ display: 'flex', justifyContent: "center", alignContent: "center" }}>
                    <OverlayTrigger
                        key="right"
                        placement="right"
                        overlay={
                            <Tooltip id="tooltip-right">
                                Projects that have been funded the most
                        </Tooltip>
                        }
                    >
                        <p style={{ color: "gray", fontFamily: "sans-serif" }} > Featured Projects </p>

                    </OverlayTrigger>
                </div>
                <div style={{ textAlign: "center" }}>
                    <div
                        style={{
                            margin: "5px",
                            textAlign: "center", width: "850px",
                            display: "inline-block"
                        }}
                    >
                        {this.renderCarousel(projects)}
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(HomePage);
