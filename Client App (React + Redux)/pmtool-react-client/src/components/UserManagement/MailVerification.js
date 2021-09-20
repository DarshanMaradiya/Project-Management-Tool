import React, { useEffect, useState } from "react"
import useLoader from "../../hooks/useLoader"
import {
	getMailVerificationCode,
	getUniqueAlphaNumericCode,
	sendMail
} from "../../UDFs"
import PropTypes from "prop-types"
import { connect, useDispatch } from "react-redux"
import LoadingImg from "../UI/LoadingImg"
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	makeStyles,
	TextField,
	Tooltip,
	Zoom
} from "@material-ui/core"
import { setUserVerified } from "../../actions/SecurityActions"
import classnames from "classnames"
import ContainedButtons from "../UI/ContainedButton"
import ReactDOMServer from "react-dom/server"
import {
	Email,
	Item,
	Span,
	A,
	renderEmail,
	configStyleValidator,
	Box,
	Image
} from "react-html-email"
import toolNameImage from "../../assets/ToolName.jpg"

const useStyles = makeStyles((theme) => ({
	container: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		height: "100%",
		background: "#009DE6"
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		border: "2px solid #000",
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		width: "30%"
	},
	toolTip: {
		maxWidth: 500,
		fontSize: 15
	},
	buttonIcon: {
		cursor: "pointer",
		width: "30px",
		height: "30px",
		margin: "1px"
	},
	bootstrapToolTip: {
		arrow: {
			color: theme.palette.common.black
		},
		tooltip: {
			backgroundColor: theme.palette.common.black
		}
	},
	textField: {
		width: "100%",
		padding: "0.1cm",
		margin: "0.1cm"
	},
	textLink: {
		color: "#3F51B5",
		cursor: "pointer",
		"&:hover": {
			textDecoration: "underline"
		}
	},
	mailBody: {
		container: {
			display: "flex",
			flexDirection: "column",
			justifyContent: "center",
			alignItems: "center",
			width: "100%",
			height: "100%"
		}
	}
}))

const HTMLEmail = ({ code, classes, name }) => {
	return (
		<Email title='verification'>
			<div className={classes.container}>
				<center>
					<div
						style={{
							backgroundImage:
								"url(" +
								"https://raw.githubusercontent.com/DarshanMaradiya/Images/766d5b9434964e2bc2d04002184e23d0a5236239/ToolName.jpg" +
								")",
							backgroundSize: "100%",
							width: "500px",
							height: "115px"
						}}
					></div>
				</center>
				<center>
					<h1 style={{ width: "500px" }}>
						Verification of your Account
					</h1>
				</center>
				<center>
					<h4 style={{ width: "500px" }}>Hello, {name}</h4>
				</center>
				<center>
					<h4 style={{ width: "500px" }}>
						Your Verification Code is{" "}
					</h4>
				</center>
				<center>
					<div style={{ border: "2px dashed", width: "500px" }}>
						<h3>{code}</h3>
					</div>
				</center>
			</div>
		</Email>
	)
}

configStyleValidator({
	// When strict, incompatible style properties will result in an error.
	strict: true,

	// Whether to warn when compatibility notes for a style property exist.
	warn: true,

	// Platforms to consider for compatibility checks.
	platforms: [
		"gmail",
		"gmail-android",
		"apple-mail",
		"apple-ios",
		"yahoo-mail",
		"outlook",
		"outlook-legacy",
		"outlook-web"
	]
})

const MailBody = (code) => {
	// const element = `<html><head><style>.container{display: flex;	justify-content: center; align-items: center; width: 100%; height: 100%; border: 2px solid black}</style></head></body><div class=\"container\"><h1>Your verification code is ${code}</h1></div></body></html>`
	const element =
		'<html>\r\n<head>\r\n\t<style type="text/css">\r\n\t\t.container {\r\n\t\t\tdisplay: flex;\r\n\t\t\tflex-direction: column;\r\n\t\t\tjustify-content: center;\r\n\t\t\talign-items: space-around;\r\n\t\t\twidth: 100%;\r\n\t\t\theight: 100%;\r\n\t\t\tborder: 2px solid black\r\n\t\t}\r\n\t</style>\r\n\t\r\n</head>\r\n<body>\r\n\t<div class="container">\r\n\t\t<center><h2>Verification of your Account</h2></center>\r\n\t\t<center><div>Your Verification Code is: <span  onclick="alert(\'code is copied to clipboard\');" title="click to copy the code">abcd1234</span></div></center>\r\n\t</div>\r\n</body>\r\n</html>'
	return element
}

function MailVerification(props) {
	const classes = useStyles()
	const generatedCode = getMailVerificationCode()
	const emailRequest = {
		email: props.email,
		subject: "[PMT] Verify Your Email Address",
		// body: "<h1>Your verification code is " + generatedCode + "<h1>"
		body: renderEmail(
			<HTMLEmail
				code={generatedCode}
				classes={classes.mailBody}
				name={props.name}
			/>
		).toString() // HTML code
	}
	console.log(emailRequest.body)
	let loaderArgs = sendMail(emailRequest)
	const [
		loadingSentMail,
		responseSentMail,
		errorSentMail,
		sendVerificationMail
	] = useLoader(loaderArgs)

	loaderArgs = setUserVerified(props.history, "/role", useDispatch())

	const [loadingVerifyMail, responseVerifyMail, errorVerifyMail, verifyUser] =
		useLoader(loaderArgs)

	const [code, setCode] = useState("")
	const [error, setError] = useState("")

	useEffect(() => {
		sendVerificationMail()
		return () => {
			localStorage.removeItem("verificationCode")
		}
	}, [])

	const onChange = (e) => {
		setError("")
		setCode(e.target.value)
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		if (code === generatedCode) {
			console.log("set verified = true")

			verifyUser()
		} else setError("Wrong Verification Code")
	}

	return (
		<div className={classes.container}>
			<Card className={classes.paper}>
				<CardHeader
					title={<h1>Verify Your Account</h1>}
					subheader={
						loadingSentMail ? (
							<h4>Sending Verification Mail...</h4>
						) : loadingVerifyMail ? (
							<h4>Verifying...</h4>
						) : (
							<h4>
								We have sent a verification code to your
								registered email address.
							</h4>
						)
					}
				/>

				<CardContent>
					<center>
						<form onSubmit={handleSubmit}>
							<Tooltip
								arrow
								className={classes.bootstrapToolTip}
								title={error ? <h6>{error}</h6> : ""}
								placement='left'
								open={error != null}
								TransitionComponent={Zoom}
							>
								<TextField
									name='code'
									type='text'
									value={code}
									onChange={onChange}
									label='Enter Your Verification Code'
									variant='outlined'
									className={classes.textField}
									error={Boolean(error)}
									autoFocus={true}
									disabled={
										loadingSentMail || loadingVerifyMail
									}
								/>
							</Tooltip>
						</form>
						<div>
							If you haven't received the mail, then click on{" "}
							<span
								className={classes.textLink}
								onClick={sendVerificationMail}
							>
								Resend
							</span>
						</div>
					</center>
				</CardContent>
			</Card>
		</div>
	)
}

MailVerification.propTypes = {
	email: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
	email: state.security.user.username,
	name: state.security.user.fullName
})

export default connect(mapStateToProps, null)(MailVerification)
