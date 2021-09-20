import {
	Backdrop,
	Fade,
	makeStyles,
	Modal,
	Tooltip,
	Zoom
} from "@material-ui/core"
import React, { useEffect } from "react"
import { useDispatch } from "react-redux"
import { getProjectTask } from "../../../actions/backlogActions"
import useLoader from "../../../hooks/useLoader"
import LoadingImg from "../../UI/LoadingImg"

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
	toolTip: {
		maxWidth: 500,
		fontSize: 15
	}
}))

const ProjectTaskModal = (props) => {
	const classes = useStyles()
	const { open, setOpen } = props

	const loaderArgs = getProjectTask(
		props.projectIdentifier,
		props.projectSequence,
		useDispatch()
	)

	const [loading, response, error, getTaskDetails] = useLoader(loaderArgs)

	// useEffect(() => {
	// 	open && getTaskDetails()
	// }, [open])

	const handleOpen = () => {
		getTaskDetails()
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	return (
		<div>
			<Tooltip
				title='Click to Update task'
				placement='right'
				TransitionComponent={Zoom}
				classes={{ tooltip: classes.toolTip }}
			>
				<button
					type='button'
					onClick={handleOpen}
					className={`btn btn-secondary ${classes.absolute}`}
				>
					Update Task
				</button>
			</Tooltip>
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
						{loading ? <LoadingImg /> : props.children}
					</div>
				</Fade>
			</Modal>
		</div>
	)
}

export default ProjectTaskModal
