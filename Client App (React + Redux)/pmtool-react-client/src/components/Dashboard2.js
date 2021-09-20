import React, { useEffect } from "react"
import { connect, useDispatch } from "react-redux"
import { getProjects } from "../actions/projectActions"
import CreateProjectButton from "./Project/CreateProjectButton"
import ProjectItem from "./Project/ProjectItem"
import PropTypes from "prop-types"
import useLoader from "../hooks/useLoader"
import LoadingImg from "./UI/LoadingImg"
import CustomizedSnackbars from "./UI/CustomizedSnackBar"
import MemberDashboard from "./MemberDashboard"

const Dashboard2 = (props) => {
	const dispatch = useDispatch()
	const loaderArgs = getProjects(dispatch)
	const [loading, response, error, getProjectsList] = useLoader(loaderArgs)
	let [loginModeSnackBar, setLoginModeSnackBar] = CustomizedSnackbars({
		severity: "success",
		message:
			"Logged in as Team " +
			(props.role === "member" ? "Member" : "Leader"),
		duration: 5000,
		vertical: "bottom",
		horizontal: "left",
		transitionDirection: "up"
	})
	useEffect(() => {
		if (!props.verified) {
			props.history.push("/verify")
		}

		getProjectsList()
	}, [])

	useEffect(() => {
		setLoginModeSnackBar(true)
	}, [props.role])

	const { projects } = props.project

	const memberDashboard = (
		<div>
			<MemberDashboard />
			{loginModeSnackBar}
		</div>
	)
	const leaderDashboard = (
		<div className='projects'>
			<div className='container'>
				<div className='row'>
					<div className='col-md-12'>
						<h1 className='display-4 text-center'>Projects</h1>
						<br />
						<CreateProjectButton />
						<br />
						<hr />
						{loading ? (
							<LoadingImg />
						) : (
							projects.map((projectObject) => (
								<ProjectItem
									key={projectObject.id}
									project={projectObject}
								/>
							))
						)}
					</div>
				</div>
			</div>
			{loginModeSnackBar}
		</div>
	)
	return props.role == "member" ? memberDashboard : leaderDashboard
}

Dashboard2.propTypes = {
	project: PropTypes.object.isRequired,
	getProjects: PropTypes.func.isRequired,
	role: PropTypes.string.isRequired,
	verified: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
	project: state.project,
	role: state.security.role,
	verified: state.security.user && state.security.user.verified
})

export default connect(mapStateToProps, { getProjects })(Dashboard2)
