import React, { useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Modal from "@material-ui/core/Modal"
import Backdrop from "@material-ui/core/Backdrop"
import Fade from "@material-ui/core/Fade"
import { deepOrange, deepPurple } from "@material-ui/core/colors"
import { Avatar, Tooltip, Zoom } from "@material-ui/core"
import { classnames } from "classnames"
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd"

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
		padding: theme.spacing(2, 4, 3)
	},
	orange: {
		color: theme.palette.getContrastText(deepOrange[500]),
		backgroundColor: deepOrange[500]
	},
	purple: {
		color: theme.palette.getContrastText(deepPurple[500]),
		backgroundColor: deepPurple[500]
	},
	absolute: {
		position: "relative",
		bottom: theme.spacing(1)
		// left: theme.spacing(1)
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
	}
}))

export default function TaskAssignmentTransitionsModal(props) {
	const classes = useStyles()
	const { open, setOpen } = props

	const handleOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	// ===========================================================================
	let avatarColor
	let avatarText = ""
	if (props.assignee) {
		let colors = [classes.orange, classes.purple]
		avatarColor = colors[0] //colors[Math.floor(Math.random() * colors.length)]
		props.assignee.user.fullname.split(" ").forEach((text) => {
			avatarText += text[0]
		})
	} else console.log(props.assignee)
	// ===========================================================================

	return (
		<div>
			{props.assignee != null ? (
				<Tooltip
					title={props.assignee.user.fullname}
					placement='bottom'
					TransitionComponent={Zoom}
					classes={{ tooltip: classes.toolTip }}
				>
					<Avatar
						className={classes.buttonIcon}
						onClick={handleOpen}
						src={props.assignee.user.imageUrl}
					>
						{avatarText}
					</Avatar>
				</Tooltip>
			) : (
				<Tooltip
					title='Assign task'
					placement='bottom'
					TransitionComponent={Zoom}
					classes={{ tooltip: classes.toolTip }}
				>
					<AssignmentIndIcon
						onClick={handleOpen}
						className={classes.buttonIcon}
					/>
					{
						// <button
						// 	type='button'
						// 	onClick={handleOpen}
						// 	className={`btn btn-secondary ${classes.absolute}`}
						// >
						// 	Assign Task
						// </button>
					}
				</Tooltip>
			)}
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
					<div className={classes.paper}>{props.children}</div>
				</Fade>
			</Modal>
		</div>
	)
}
