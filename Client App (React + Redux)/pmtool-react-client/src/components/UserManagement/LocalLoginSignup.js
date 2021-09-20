import React, { useEffect, useState } from "react"
import ContainedButtons from "../UI/ContainedButton"
import classnames from "classnames"
import { CSSTransition } from "react-transition-group"
import {
	Button,
	Divider,
	Grow,
	makeStyles,
	TextField,
	Tooltip,
	Zoom
} from "@material-ui/core"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { createNewUser, login, loginAs } from "../../actions/SecurityActions"
import { cleanupErrorsState } from "../../actions/errorsActions"
import CustomizedSnackbars from "../UI/CustomizedSnackBar"

const useStyle = makeStyles((theme) => {
	// console.log(theme)
	return {
		divider: {
			display: "grid",
			gridTemplateColumns: "3fr 1fr 3fr",
			gridTemplateRows: "1fr",
			alignItems: "center"
		},
		form: {
			display: "flex",
			flexDirection: "column",
			justifyContent: "space-between",
			padding: "0.1cm",
			transition: "0.4s"
		},
		textField: {
			width: "100%",
			padding: "0.1cm",
			transition: "0.6s",
			margin: "0.1cm"
		},
		errorMessage: {
			// height: ""
			color: "#F44336"
			// height: "0.7cm"
		},
		hideElement: {
			display: "none"
		},
		submitButtonSet: {
			display: "flex",
			flexDirection: "row",
			width: "100%",
			justifyContent: "space-around",
			height: "100%",
			padding: "0px",
			height: "40px"
		},
		textButton: {
			width: "100%",
			height: "40px",
			display: "flex",
			alignItems: "center",
			alignContent: "center",
			justifyContent: "center",
			"&:hover": {
				background: "#3F51Bf"
			}
		},
		verticalDivider: {
			border: "1px solid white",
			height: "25px",
			width: "1px",
			background: "white"
			// right: "249px",
			// top: "10px"
		},
		textLink: {
			color: "#3F51B5",
			cursor: "pointer",
			"&:hover": {
				textDecoration: "underline"
			}
		},
		bootstrapToolTip: {
			arrow: {
				color: theme.palette.common.black
			},
			tooltip: {
				backgroundColor: theme.palette.common.black
			}
		},
		formToggleLink: {
			// display: "flex",
			justifySelf: "flex-end",
			marginTop: "0.1cm"
		}
	}
})

function LocalLoginSignup(props) {
	const classes = useStyle()

	const [errors, setErrors] = useState({})
	const [role, setRole] = useState("")
	const [fullname, setFullname] = useState("")
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const login = true
	const signup = false
	const [formMode, setFormMode] = useState(login)
	const [snackBar, setOpenSnackbar] = CustomizedSnackbars({
		// severity: "error",
		message: errors.invalidLoginResponse,
		vertical: "bottom",
		horizontal: "left",
		background: "red",
		transitionDirection: "right"
	})

	useEffect(() => {
		setErrors({})
		setOpenSnackbar(false)
	}, [formMode])

	useEffect(() => {
		console.log("reached")
		setErrors(props.errors)
		if (props.errors.invalidLoginResponse) {
			console.log("reached2")
			setOpenSnackbar(true)
		} else setOpenSnackbar(false)
	}, [props.errors])

	useEffect(() => {
		if (props.security.validToken) {
			if (formMode == signup) props.history.push("/verify")
			else props.loginAs(role, props.history)
		}
	}, [props.security.validToken])

	const onChange = (e) => {
		setErrors({ ...errors, [e.target.name]: "" })
		if (formMode == login) {
			setOpenSnackbar(false)
			props.cleanupErrorsState()
		}
		switch (e.target.name) {
			case "fullname":
				setFullname(e.target.value)
				break
			case "username":
				setUsername(e.target.value)
				break
			case "password":
				setPassword(e.target.value)
				break
			case "confirmPassword":
				setConfirmPassword(e.target.value)
				break
		}
	}

	const handleSubmit = (role) => {
		setRole(role)
		props.cleanupErrorsState()
		if (formMode == login) {
			const loginRequest = {
				username: username,
				password: password
				// provider: "local"
			}
			props.login(loginRequest)

			// console.log("Login as", role)
		} else {
			const newUser = {
				fullname: fullname,
				username: username,
				password: password,
				confirmPassword: confirmPassword,
				provider: "local"
			}
			// console.log(newUser, props.history)
			props.createNewUser(newUser)
			// console.log("Signup as", role)
		}
	}

	return (
		<div>
			<div className={classes.divider}>
				<Divider />
				<center>{" OR "}</center>
				<Divider />
			</div>

			<div
				className={classes.form}
				{...(formMode == signup ? { timeout: 1000 } : {})}
			>
				<CSSTransition
					in={formMode == signup}
					timeout={350}
					// classNames='display'
					unmountOnExit
				>
					<Grow in={formMode == signup}>
						<Tooltip
							arrow
							className={classes.bootstrapToolTip}
							title={
								errors.fullname ? (
									<h6>{errors.fullname}</h6>
								) : (
									""
								)
							}
							placement='right'
							open={errors.fullname != null}
							TransitionComponent={Zoom}
						>
							<TextField
								name='fullname'
								type='text'
								value={fullname}
								onChange={onChange}
								label='Full Name'
								variant='outlined'
								className={classes.textField}
								error={Boolean(errors.fullname)}
							/>
						</Tooltip>
					</Grow>
				</CSSTransition>
				<Tooltip
					arrow
					className={classes.bootstrapToolTip}
					title={errors.username ? <h6>{errors.username}</h6> : ""}
					placement='right'
					open={errors.username != null}
					TransitionComponent={Zoom}
				>
					<TextField
						name='username'
						type='text'
						value={username}
						onChange={onChange}
						label='Email Address (Username)'
						variant='outlined'
						className={classes.textField}
						error={Boolean(
							errors.username || errors.invalidLoginResponse
						)}
					/>
				</Tooltip>
				<Tooltip
					arrow
					className={classes.bootstrapToolTip}
					title={errors.password ? <h6>{errors.password}</h6> : ""}
					placement='right'
					open={errors.password != null}
					TransitionComponent={Zoom}
				>
					<TextField
						name='password'
						type='password'
						value={password}
						onChange={onChange}
						label='Password'
						variant='outlined'
						className={classes.textField}
						error={Boolean(
							errors.password || errors.invalidLoginResponse
						)}
					/>
				</Tooltip>
				<CSSTransition
					in={formMode == signup}
					timeout={350}
					unmountOnExit
				>
					<Grow
						in={formMode == signup}
						{...(formMode == signup ? { timeout: 1000 } : {})}
					>
						<Tooltip
							arrow
							className={classes.bootstrapToolTip}
							title={
								errors.confirmPassword ? (
									<h6>{errors.confirmPassword}</h6>
								) : (
									""
								)
							}
							placement='right'
							open={errors.confirmPassword != null}
							TransitionComponent={Zoom}
						>
							<TextField
								name='confirmPassword'
								type='password'
								value={confirmPassword}
								onChange={onChange}
								label='Confirm Password'
								variant='outlined'
								className={classes.textField}
								error={Boolean(errors.confirmPassword)}
							/>
						</Tooltip>
					</Grow>
				</CSSTransition>
			</div>

			{formMode == login ? (
				<Button
					variant='contained'
					className={classes.submitButtonSet}
					color='primary'
				>
					<span
						onClick={() => handleSubmit("leader")}
						className={classes.textButton}
					>
						Login as Team Leader
					</span>
					<div className={classes.verticalDivider}></div>
					<span
						onClick={() => handleSubmit("member")}
						className={classes.textButton}
					>
						Login as Team Member
					</span>
				</Button>
			) : (
				<Button
					variant='contained'
					className={classes.submitButtonSet}
					color='primary'
					onClick={handleSubmit}
				>
					Signup and Verify
				</Button>
			)}

			<div className={classes.formToggleLink}>
				{formMode == login ? (
					<div>
						{
							// <center>
							// {"Forgot Password? "}
							// <span
							// 	className={classes.textLink}
							// 	onClick={() => setFormMode(signup)}
							// >
							// 	Reset Password
							// </span>
							// </center>
						}
						<center>
							{"Don't have an account? "}
							<span
								className={classes.textLink}
								onClick={() => setFormMode(signup)}
							>
								Create account
							</span>
						</center>
					</div>
				) : (
					<center>
						{"Already have an account? "}
						<span
							className={classes.textLink}
							onClick={() => setFormMode(login)}
						>
							Login to existing account
						</span>
					</center>
				)}
			</div>

			{snackBar}
		</div>
	)
}

LocalLoginSignup.propTypes = {
	createNewUser: PropTypes.func.isRequired,
	errors: PropTypes.object.isRequired,
	security: PropTypes.object.isRequired,
	cleanupErrorsState: PropTypes.func.isRequired,
	login: PropTypes.func.isRequired,
	loginAs: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
	errors: { ...state.errors },
	security: state.security
})

export default connect(mapStateToProps, {
	login,
	createNewUser,
	cleanupErrorsState,
	loginAs
})(LocalLoginSignup)
