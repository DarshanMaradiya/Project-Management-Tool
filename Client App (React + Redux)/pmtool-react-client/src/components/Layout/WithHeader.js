import Dashboard from "../../components/Dashboard"
import Header from "../../components/Layout/Header"
import "bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import AddProject from "../../components/Project/AddProject"
import { Provider } from "react-redux"
import store from "../../store"
import UpdateProject from "../../components/Project/UpdateProject"
import ProjectBoard from "../../components/ProjectBoard/ProjectBoard"
import AddProjectTask from "../../components/ProjectBoard/ProjectTasks/AddProjectTask"
import UpdateProjectTask from "../../components/ProjectBoard/ProjectTasks/UpdateProjectTask"
import Landing from "../../components/Layout/Landing"
import Register from "../../components/UserManagement/Register"
import Login from "../../components/UserManagement/Login"
import setJWTToken from "../../securityUtils/setJWTToken"
import jwtDecode from "jwt-decode"
import { SET_CURRENT_USER } from "../../actions/types"
import PropTypes from "prop-types"
import { logout } from "../../actions/SecurityActions"
import SecureRoute from "../../securityUtils/SecureRoute"
import AddTeamMembers from "../../components/Team/AddTeamMembers"
import UpdateTeamMembers from "../../components/Team/UpdateTeamMembers"
import TestingUI from "../../components/UI/TestingUI"
import ProjectBoard2 from "../../components/ProjectBoard/ProjectBoard2"
import Dashboard2 from "../../components/Dashboard2"
import OAuth2RedirectHandler from "../../components/OAuth2/OAuth2RedirectHandler"
import Landing2 from "../../components/UserManagement/Landing2"
import withHeader from "../../components/Layout/WithHeader"
import LoginMode from "./LoginMode"
import React from "react"
import { makeStyles } from "@material-ui/core"

const jwtToken = localStorage.jwtToken

if (jwtToken) {
	setJWTToken(jwtToken)
	const decodedToken = jwtDecode(jwtToken)
	store.dispatch({
		type: SET_CURRENT_USER,
		payload: decodedToken
	})

	const currentTime = Date.now() / 1000
	if (decodedToken.exp < currentTime) {
		// handle logout
		store.dispatch(logout())
		window.location.href = "/"
	}
}

const useStyle = makeStyles((theme) => ({
	wrapper: {
		display: "block",
		height: "90.5vh"
	}
}))

const WithHeader = (OriginalComponent) => {
	const classes = useStyle()
	class UpdatedComponent extends React.Component {
		render() {
			return (
				<div className={classes.wrapper}>
					<Header history={this.props} />
					<div style={{ paddingTop: "9.5vh", height: "100vh" }}>
						<OriginalComponent {...this.props} />
					</div>
				</div>
			)
		}
	}
	return UpdatedComponent
}

export default WithHeader
