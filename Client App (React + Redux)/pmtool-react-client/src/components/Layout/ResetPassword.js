import {
	Backdrop,
	Card,
	CardContent,
	CardHeader,
	Divider,
	Fade,
	makeStyles,
	Modal,
	TextField,
	Tooltip,
	Zoom
} from "@material-ui/core"
import React, { useEffect, useState } from "react"
import { connect, useDispatch } from "react-redux"
import ContainedButtons from "../UI/ContainedButton"
import PropTypes from "prop-types"
import { resetPassword } from "../../actions/SecurityActions"
import useLoader from "../../hooks/useLoader"
import { cleanupErrorsState } from "../../actions/errorsActions"

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
		transition: "0.6s",
		margin: "0.1cm"
	}
}))

function ResetPassword(props) {
	const classes = useStyles()
	const [open, setOpen] = useState(false)
	const [request, setRequest] = useState({
		currentPassword: "",
		newPassword: "",
		confirmNewPassword: ""
	})
	const [errors, setErrors] = useState({})
	const [requested, setRequested] = useState(false)

	const loaderArgs = resetPassword(request, props.history, useDispatch())
	const [loading, response, error, reset] = useLoader(loaderArgs)

	useEffect(() => {
		setErrors(props.errors)
	}, [props.errors])

	useEffect(() => {
		if (response != null && response.token) {
			console.log("Reset successful\n", response.data)
			props.cleanupErrorsState()
			handleClose()
		}
	}, [response])

	const handleOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
		props.cleanupErrorsState()
		setRequest({
			currentPassword: "",
			newPassword: "",
			confirmNewPassword: ""
		})
	}

	const onChange = (e) => {
		setErrors({
			...errors,
			[e.target.name]: ""
		})
		setRequest({
			...request,
			[e.target.name]: e.target.value
		})
	}

	const handleSubmit = () => {
		// e.preventDefault()
		if (request.newPassword !== request.confirmNewPassword) {
			setErrors({
				...errors,
				confirmNewPassword: "passwords are not matching"
			})
			return
		}
		// const passwordResetRequest = {
		// 	currentPassword: request.currentPassword,
		// 	newPassword: request.newPassword,
		// 	confirmNewPassword: request.confirmNewPassword
		// }
		reset()
		// console.log(passwordResetRequest)
	}

	return (
		<div>
			<div onClick={handleOpen}>{props.buttonText}</div>

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
					<Card className={classes.paper}>
						<CardHeader
							title={
								<center>
									<b>
										<h4>Reset Password</h4>
									</b>
								</center>
							}
						/>

						<Divider />
						<CardContent>
							<form>
								<Tooltip
									arrow
									className={classes.bootstrapToolTip}
									title={
										errors.currentPassword ? (
											<h6>{errors.currentPassword}</h6>
										) : (
											""
										)
									}
									placement='right'
									open={errors.currentPassword != null}
									TransitionComponent={Zoom}
								>
									<TextField
										name='currentPassword'
										type='password'
										value={request.currentPassword}
										onChange={onChange}
										label='Current Password'
										variant='outlined'
										className={classes.textField}
										error={Boolean(errors.currentPassword)}
									/>
								</Tooltip>
								<Tooltip
									arrow
									className={classes.bootstrapToolTip}
									title={
										errors.newPassword ? (
											<h6>{errors.newPassword}</h6>
										) : (
											""
										)
									}
									placement='right'
									open={errors.newPassword != null}
									TransitionComponent={Zoom}
								>
									<TextField
										name='newPassword'
										type='password'
										value={request.newPassword}
										onChange={onChange}
										label='New Password'
										variant='outlined'
										className={classes.textField}
										error={Boolean(errors.newPassword)}
									/>
								</Tooltip>
								<Tooltip
									arrow
									className={classes.bootstrapToolTip}
									title={
										errors.confirmNewPassword ? (
											<h6>{errors.confirmNewPassword}</h6>
										) : (
											""
										)
									}
									placement='right'
									open={errors.confirmNewPassword != null}
									TransitionComponent={Zoom}
								>
									<TextField
										name='confirmNewPassword'
										type='password'
										value={request.confirmNewPassword}
										onChange={onChange}
										label='Confirm New Password'
										variant='outlined'
										className={classes.textField}
										error={Boolean(
											errors.confirmNewPassword
										)}
									/>
								</Tooltip>

								<center>
									<ContainedButtons
										text={loading ? "Resetting" : "Reset"}
										variant='contained'
										color='primary'
										onClick={handleSubmit}
										disabled={
											request.currentPassword === "" ||
											request.newPassword === "" ||
											request.confirmNewPassword === "" ||
											loading
										}
									/>
								</center>
							</form>
						</CardContent>
					</Card>
				</Fade>
			</Modal>
		</div>
	)
}

ResetPassword.propTypes = {
	errors: PropTypes.object.isRequired,
	cleanupErrorsState: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
	errors: state.errors
})

export default connect(mapStateToProps, { cleanupErrorsState })(ResetPassword)
