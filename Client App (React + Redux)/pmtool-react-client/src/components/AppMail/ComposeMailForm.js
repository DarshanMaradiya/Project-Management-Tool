import {
	Backdrop,
	Fade,
	ListItem,
	ListItemIcon,
	ListItemText,
	makeStyles,
	Modal,
	TextField,
	Tooltip,
	Zoom
} from "@material-ui/core"
import React, { useEffect, useState } from "react"
import CreateIcon from "@material-ui/icons/Create"
import ContainedButtons from "../UI/ContainedButton"
import useLoader from "../../hooks/useLoader"
import { sendMail } from "../../actions/mailboxActions"
import { connect, useDispatch } from "react-redux"
import PropTypes from "prop-types"
import classnames from "classnames"
import { cleanupErrorsState } from "../../actions/errorsActions"
import SendIcon from "@material-ui/icons/Send"
import ClearIcon from "@material-ui/icons/Clear"
import CustomizedSnackbars from "../UI/CustomizedSnackBar"

const useStyles = makeStyles((theme) => ({
	modal: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		border: "2px solid #000",
		boxShadow: theme.shadows[5],
		padding: theme.spacing(3, 3, 3, 3),
		width: "30%",
		height: "50%",
		borderRadius: "5px"
	},
	input: {
		display: "flex",
		justifyContent: "space-between"
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
		transition: "0.6s",
		margin: "2px"
	},
	buttonIcon: {
		cursor: "pointer",
		width: "30px",
		height: "30px",
		margin: "1px"
	},
	toolTip: {
		maxWidth: 500,
		fontSize: 15
	}
}))

function ComposeMailForm(props) {
	const classes = useStyles()
	const [open, setOpen] = useState(false)
	const [recipient, setRecipient] = useState(props.recipient || "")
	const [message, setMessage] = useState("")
	const [subject, setSubject] = useState("")
	const [errors, setErrors] = useState(props.errors)
	const [attempt, setAttempt] = useState(false)

	const [loading, response, error, send] = useLoader(
		sendMail(
			{
				subject,
				receiver: recipient,
				message,
				sender: props.sender
			},
			useDispatch()
		)
	)

	let [mailSentSnackBar, setMailSentSnackBar] = CustomizedSnackbars({
		severity: "success",
		message: "Mail is Sent",
		duration: 5000,
		vertical: "bottom",
		horizontal: "left",
		transitionDirection: "up"
	})

	useEffect(() => {
		setErrors(props.errors)
	}, [props.errors])

	useEffect(() => {
		if (loading == false && !errors.userNotFound) {
			setOpen(false)
			if (attempt) {
				setAttempt(false)
				setMailSentSnackBar(true)
			}
		}
	}, [loading])

	const handleOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	const onChange = (e) => {
		switch (e.target.name) {
			case "recipient":
				setErrors({
					...errors,
					recipient: ""
				})
				props.cleanupErrorsState()
				setRecipient(e.target.value)
				break
			case "subject":
				setErrors({
					...errors,
					subject: ""
				})
				setSubject(e.target.value)
				break
			case "message":
				setErrors({
					...errors,
					message: ""
				})
				setMessage(e.target.value)
				break
		}
	}

	const cancelMail = () => {
		setRecipient("")
		setMessage("")
		setSubject("")
		setErrors({})
		props.cleanupErrorsState()
		setOpen(false)
	}

	const handleSubmit = () => {
		if (recipient === "") {
			setErrors({
				...errors,
				userNotFound: "Enter the recipient"
			})
			return
		}
		if (message === "") {
			setErrors({
				...errors,
				message: "Enter some message"
			})
			return
		}
		setAttempt(true)
		send()
	}

	return (
		<div>
			<ListItem button key={"ComposeMail"} onClick={handleOpen}>
				<ListItemIcon>
					<CreateIcon />
				</ListItemIcon>
				<ListItemText primary={"Compose Mail"} />
			</ListItem>
			<Modal
				aria-labelledby='transition-modal-title'
				aria-describedby='transition-modal-description'
				className={classes.modal}
				open={open}
				onClose={handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500
				}}
			>
				<Fade in={open}>
					<div className={classes.paper}>
						<div>
							<Tooltip
								title={errors.userNotFound || ""}
								placement='top'
								TransitionComponent={Zoom}
								classes={{ tooltip: classes.toolTip }}
								open={Boolean(errors.userNotFound)}
							>
								<TextField
									id='outlined-basic'
									label='To'
									variant='outlined'
									className={classes.textField}
									error={Boolean(errors.userNotFound)}
									value={recipient}
									name='recipient'
									onChange={onChange}
								/>
							</Tooltip>
						</div>
						<div>
							<Tooltip
								title={errors.message || ""}
								placement='bottom'
								TransitionComponent={Zoom}
								classes={{ tooltip: classes.toolTip }}
								open={Boolean(errors.message)}
							>
								<TextField
									id='outlined-basic'
									label='Subject'
									variant='outlined'
									name='subject'
									className={classes.textField}
									value={subject}
									onChange={onChange}
								/>
							</Tooltip>
						</div>
						<div>
							<TextField
								id='outlined-basic'
								label='Message'
								variant='outlined'
								name='message'
								className={classes.textField}
								error={Boolean(errors.message)}
								multiline
								rows={10}
								value={message}
								onChange={onChange}
							/>
						</div>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between"
							}}
						>
							<Tooltip
								title='Cancel Mail'
								placement='right'
								TransitionComponent={Zoom}
								classes={{ tooltip: classes.toolTip }}
							>
								<ClearIcon
									className={classes.buttonIcon}
									onClick={cancelMail}
								/>
							</Tooltip>
							<Tooltip
								title='Send'
								placement='left'
								TransitionComponent={Zoom}
								classes={{ tooltip: classes.toolTip }}
							>
								<SendIcon
									className={classes.buttonIcon}
									onClick={handleSubmit}
								/>
							</Tooltip>
						</div>
					</div>
					{
						// <div className={classes.paper}>
						// 	<h3>Compose Mail</h3>
						// 	<div>
						// 		To{" "}
						// 		<Tooltip
						// 			arrow
						// 			className={classes.bootstrapToolTip}
						// 			title={
						// 				errors.userNotFound ? (
						// 					<h6>"Recipient does not exist"</h6>
						// 				) : (
						// 					""
						// 				)
						// 			}
						// 			placement='right'
						// 			open={errors.userNotFound != null}
						// 			TransitionComponent={Zoom}
						// 		>
						// 			<TextField
						// 				name='recipient'
						// 				type='text'
						// 				value={recipient}
						// 				onChange={onChange}
						// 				label='Recipient'
						// 				variant='outlined'
						// 				className={classes.textField}
						// 				error={Boolean(errors.userNotFound)}
						// 			/>
						// 		</Tooltip>
						// 	</div>
						// 	<div className={classes.input}>
						// 		Subject{" "}
						// 		<input
						// 			type='text'
						// 			name='subject'
						// 			value={subject}
						// 			onChange={onChange}
						// 		/>
						// 	</div>
						// 	<div className={classes.input}>
						// 		Message{" "}
						// 		<input
						// 			type='text'
						// 			name='message'
						// 			value={message}
						// 			onChange={onChange}
						// 		/>
						// 	</div>
						// 	<div>
						// 		<center>
						// 			<ContainedButtons
						// 				text='Send'
						// 				variant='contained'
						// 				color='primary'
						// 				onClick={handleSubmit}
						// 			/>
						// 		</center>
						// 	</div>
						// </div>
					}
				</Fade>
			</Modal>
			{mailSentSnackBar}
		</div>
	)
}

ComposeMailForm.propTypes = {
	sender: PropTypes.string.isRequired,
	errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
	sender: state.security.user.username,
	errors: state.errors
})

export default connect(mapStateToProps, { cleanupErrorsState })(ComposeMailForm)
