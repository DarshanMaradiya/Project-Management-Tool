import "./App.css"
import Dashboard from "./components/Dashboard"
import Header from "./components/Layout/Header"
import "bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import AddProject from "./components/Project/AddProject"
import { Provider } from "react-redux"
import store from "./store"
import UpdateProject from "./components/Project/UpdateProject"
import ProjectBoard from "./components/ProjectBoard/ProjectBoard"
import AddProjectTask from "./components/ProjectBoard/ProjectTasks/AddProjectTask"
import UpdateProjectTask from "./components/ProjectBoard/ProjectTasks/UpdateProjectTask"
import Landing from "./components/Layout/Landing"
import Register from "./components/UserManagement/Register"
import Login from "./components/UserManagement/Login"
import setJWTToken from "./securityUtils/setJWTToken"
import jwtDecode from "jwt-decode"
import { SET_CURRENT_USER, SET_ROLE } from "./actions/types"
import PropTypes from "prop-types"
import { logout } from "./actions/SecurityActions"
import SecureRoute from "./securityUtils/SecureRoute"
import AddTeamMembers from "./components/Team/AddTeamMembers"
import UpdateTeamMembers from "./components/Team/UpdateTeamMembers"
import TestingUI from "./components/UI/TestingUI"
import ProjectBoard2 from "./components/ProjectBoard/ProjectBoard2"
import Dashboard2 from "./components/Dashboard2"
import OAuth2RedirectHandler from "./components/OAuth2/OAuth2RedirectHandler"
import Landing2 from "./components/UserManagement/Landing2"
import withHeader from "./components/Layout/WithHeader"
import WithHeder from "./components/Layout/WithHeader"
import LoginMode from "./components/Layout/LoginMode"
import WithHeader from "./components/Layout/WithHeader"
import MailVerification from "./components/UserManagement/MailVerification"
import MailBox from "./components/AppMail/MailBox"

const jwtToken = localStorage.jwtToken
const role = localStorage.role

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

if (role) {
	store.dispatch({
		type: SET_ROLE,
		payload: role
	})
}

function App(props) {
	return (
		<Provider store={store}>
			<Router>
				<div className='App'>
					{
						// <Header />
					}
					{
						// Public Routes
					}
					{
						// <Route exact path='/' component={withHeader(Landing} />
						<Route exact path='/' component={Landing2} />
						// 	<Switch>
						// 	<SecureRoute exact path='/role' component={LoginMode} />
						// </Switch>
					}

					<Route exact path='/register' component={Register} />
					<Route exact path='/login' component={Login} />
					<Route exact path='/testing-ui' component={TestingUI} />
					<Route
						path='/oauth2/redirect'
						component={OAuth2RedirectHandler}
					></Route>
					{
						// Private Routes
					}
					<Switch>
						<SecureRoute
							exact
							path='/mailbox'
							component={WithHeader(MailBox)}
						/>
						<SecureRoute exact path='/role' component={LoginMode} />
						<SecureRoute
							exact
							path='/verify'
							component={MailVerification}
						/>
						<SecureRoute
							exact
							path='/dashboard'
							component={WithHeader(Dashboard2)}
						/>

						<SecureRoute
							exact
							path='/addProject'
							component={WithHeader(AddProject)}
						/>
						<SecureRoute
							exact
							path='/updateProject/:id'
							component={WithHeader(UpdateProject)}
						/>
						<SecureRoute
							exact
							path='/projectBoard/:id'
							component={WithHeader(ProjectBoard2)}
						/>
						<SecureRoute
							exact
							path='/addProjectTask/:id'
							component={WithHeader(AddProjectTask)}
						/>
						<SecureRoute
							exact
							path='/updateProjectTask/:backlog_id/:projectTask_id'
							component={WithHeader(UpdateProjectTask)}
						/>
						<SecureRoute
							exact
							path='/addTeamMembers/:project_identifier'
							component={WithHeader(AddTeamMembers)}
						/>
						<SecureRoute
							exact
							path='/updateTeamMembers/:project_identifier'
							component={WithHeader(UpdateTeamMembers)}
						/>
					</Switch>
				</div>
			</Router>
		</Provider>
	)
}

// App.propTypes = {
//   dispatch: PropTypes.func.isRequired
// }

export default App
