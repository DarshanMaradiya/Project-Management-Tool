import {
	Button,
	Card,
	CardContent,
	Divider,
	makeStyles,
	MenuItem,
	MenuList,
	TextField
} from "@material-ui/core"
import React, { useEffect, useState } from "react"
import {
	GITHUB_AUTH_URL,
	GOOGLE_AUTH_URL,
	LINKEDIN_AUTH_URL
} from "../../constants"
import googleIcon from "../../assets/LoginService/google.png"
import githubIcon from "../../assets/LoginService/github.png"
import linkedinIcon from "../../assets/LoginService/linkedin.png"
import ContainedButton from "../UI/ContainedButton"
import LocalLoginSignup from "./LocalLoginSignup"
import { CSSTransition } from "react-transition-group"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { cleanupErrorsState } from "../../actions/errorsActions"

const useStyles = makeStyles((theme) => ({
	LandingPage: {
		// height: "-web-kit-available-"
		// margin: "0.1cm",
		height: "100%",
		background: "#009DE6",
		// background: "black",
		display: "flex",
		justifyContent: "flex-start"
	},
	aboutApp: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		alignContent: "center",
		justifyItems: "center",
		textAlign: "center",
		height: "100%",
		width: "100%",
		color: "white",
		transition: "width 0.7s"
	},
	squareIcon: {
		padding: "0.2cm",
		float: "left",
		width: "1.75cm",
		minHeight: "1.5cm",
		// border: "thin black ridge",
		margin: "0.1cm",
		fontSize: "medium"
	},
	card: {
		// border: "thin black ridge",
		width: "0%",
		height: "100%",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		transition: "width 0.7s"
		// transition: "display 2s"
	},
	cardContent: {
		width: "13cm"
		// display: "flex"
		// flexDirection: "column",
		// alignContent: "space-between"
		// background: "#212121"
	},
	loginMenu: {
		display: "flex",
		flexDirection: "column",
		margin: "0.1cm",
		padding: "0.2cm",
		justifyContent: "space-evenly",
		alignItems: "centers",
		alignSelf: "center"
	},
	loginButton: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%"
	},
	loginText: {
		width: "100%",
		minHeight: "1.5cm",
		fontSize: "0.5cm",
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		textTransform: "none"
	}
}))

function Landing2(props) {
	const classes = useStyles()
	const [loadForm, setLoadForm] = useState(false)

	useEffect(() => {
		if (props.security.validToken) {
			// window.location.href = "/dashboard"
			props.history.push("/dashboard")
		}
		const timeoutID = setTimeout(() => {
			setLoadForm(true)
		}, 1500)

		return () => {
			clearTimeout(timeoutID)
			props.cleanupErrorsState()
		}
	}, [])

	return (
		<div className={classes.LandingPage}>
			<Card
				className={classes.card}
				style={loadForm ? { width: "35%" } : {}}
			>
				<CardContent className={classes.cardContent}>
					<div className={classes.loginMenu}>
						<Button
							className={classes.loginButton}
							onClick={() => (window.location = GOOGLE_AUTH_URL)}
						>
							<img
								src={googleIcon}
								className={classes.squareIcon}
							/>
							<div className={classes.loginText}>
								<span>Continue with Google</span>
							</div>
						</Button>
						<Button
							className={classes.loginButton}
							onClick={() => (window.location = GITHUB_AUTH_URL)}
						>
							<img
								src={githubIcon}
								className={classes.squareIcon}
							/>
							<div className={classes.loginText}>
								<span>Continue with Github</span>
							</div>
						</Button>
						<Button
							className={classes.loginButton}
							onClick={() =>
								(window.location = LINKEDIN_AUTH_URL)
							}
						>
							<img
								src={linkedinIcon}
								className={classes.squareIcon}
							/>
							<div className={classes.loginText}>
								<span>Continue with LinkedIn</span>
							</div>
						</Button>
						<LocalLoginSignup history={props.history} />
					</div>
				</CardContent>
			</Card>

			<div
				className={classes.aboutApp}
				style={loadForm ? { width: "65%" } : {}}
			>
				<h1 className='display-3 mb-4'>Project Management Tool</h1>
				<p className='lead'>
					Create your account to join active projects or start you own
				</p>
			</div>
		</div>
	)
}

Landing2.propTypes = {
	security: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
	security: state.security
})

export default connect(mapStateToProps, { cleanupErrorsState })(Landing2)
