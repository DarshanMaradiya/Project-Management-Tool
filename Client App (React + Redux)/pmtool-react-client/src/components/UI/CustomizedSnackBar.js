import React from "react"
import Button from "@material-ui/core/Button"
import Snackbar from "@material-ui/core/Snackbar"
import MuiAlert from "@material-ui/lab/Alert"
import { makeStyles } from "@material-ui/core/styles"
import { Slide } from "@material-ui/core"

const Alert = React.forwardRef((props, ref) => (
	<MuiAlert elevation={6} variant='filled' {...props} ref={ref} />
))

export default function CustomizedSnackbars({
	severity,
	message,
	duration,
	vertical,
	horizontal,
	transitionDirection
}) {
	const [open, setOpen] = React.useState(false)

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return
		}
		setOpen(false)
	}

	const transitionComponent = (props) => (
		<Slide {...props} direction={transitionDirection} />
	)

	const snackBar = (
		<Snackbar
			open={open}
			autoHideDuration={duration || 5000}
			onClose={handleClose}
			anchorOrigin={{ vertical, horizontal }}
			TransitionComponent={transitionComponent}
		>
			<Alert onClose={handleClose} severity={severity || "info"}>
				{message}
			</Alert>
		</Snackbar>
	)

	return [snackBar, setOpen]
}
