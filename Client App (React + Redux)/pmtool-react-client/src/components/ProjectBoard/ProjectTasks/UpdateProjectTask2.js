import React, { useEffect, useState } from "react"
import ProjectTaskModal from "./ProjectTaskModal"
import classnames from "classnames"
import { cleanupErrorsState } from "../../../actions/errorsActions"
import { PropTypes } from "prop-types"
import { connect, useDispatch } from "react-redux"
import {
	updateProjectTask,
	getProjectTask
} from "../../../actions/backlogActions"
import { deepCompare } from "../../../UDFs"
import useLoader from "../../../hooks/useLoader"
import LoadingImg from "../../UI/LoadingImg"
import {
	Backdrop,
	Fade,
	makeStyles,
	Modal,
	Tooltip,
	Zoom
} from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"

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
	},
	buttonIcon: {
		cursor: "pointer",
		width: "30px",
		height: "30px",
		margin: "1px"
	}
}))

const UpdateProjectTask2 = (props) => {
	const classes = useStyles()
	const [open, setOpen] = useState(false)
	const [errors, setErrors] = useState({})
	const [project_task, setProject_task] = useState({})
	const [disableSave, setDisableSave] = useState(true)

	const [taskDetails, setTaskDetails] = useState({
		id: project_task.id,
		summary: project_task.summary,
		projectSequence: props.projectSequence,
		acceptanceCriteria: project_task.acceptanceCriteria,
		status: project_task.status,
		available: project_task.available,
		priority: project_task.priority,
		dueDate: project_task.dueDate,
		projectIdentifier: props.projectIdentifier,
		projectName: project_task.projectName,
		assignee: project_task.assignee,
		create_At: project_task.create_At,
		completionDate: project_task.completionDate,
		approvalDate: project_task.approvalDate
	})

	const loaderArgs = getProjectTask(
		props.projectIdentifier,
		props.projectSequence,
		useDispatch()
	)

	// const [loading, response, error, getTaskDetails] = useLoader(loaderArgs)

	useEffect(() => {
		open && setErrors(props.errors)
	}, [open, props.errors])

	useEffect(() => {
		if (open) {
			const this_task = props.project_tasks.find(
				(task) =>
					task.projectSequence === props.projectSequence &&
					task.projectIdentifier === props.projectIdentifier
			)
			setProject_task(this_task)
		}
	}, [open, props.project_tasks])

	useEffect(() => {
		setTaskDetails({
			id: project_task.id,
			projectSequence: project_task.projectSequence,
			projectIdentifier: project_task.projectIdentifier,
			projectName: project_task.projectName,
			summary: project_task.summary,
			acceptanceCriteria: project_task.acceptanceCriteria,
			status: project_task.status,
			available: project_task.available,
			priority: project_task.priority,
			assignee: project_task.assignee,
			dueDate: project_task.dueDate,
			create_At: project_task.create_At,
			completionDate: project_task.completionDate,
			approvalDate: project_task.approvalDate
		})
	}, [project_task])

	const handleOpen = () => {
		const this_task = props.project_tasks.find(
			(task) =>
				task.projectSequence === props.projectSequence &&
				task.projectIdentifier === props.projectIdentifier
		)
		setProject_task({ ...this_task })
		setOpen(true)
	}

	const handleClose = () => {
		props.cleanupErrorsState()
		setOpen(false)
	}

	const onChange = (e) => {
		setTaskDetails({
			...taskDetails,
			[e.target.name]: e.target.value
		})
		setDisableSave(false)
	}

	const onSubmit = (e) => {
		setDisableSave(true)
		e.preventDefault()
		const updatedTask = {
			id: taskDetails.id,
			projectSequence: taskDetails.projectSequence,
			projectIdentifier: taskDetails.projectIdentifier,
			summary: taskDetails.summary,
			acceptanceCriteria: taskDetails.acceptanceCriteria,
			status: taskDetails.status,
			priority: taskDetails.priority,
			assignee: taskDetails.assignee,
			dueDate: taskDetails.dueDate,
			create_At: taskDetails.create_At,
			completionDate: taskDetails.completionDate,
			approvalDate: taskDetails.approvalDate
		}
		// console.log(updatedTask)
		props.updateProjectTask(taskDetails.projectIdentifier, updatedTask)
	}

	return (
		<div>
			<Tooltip
				title='Update task'
				placement='bottom'
				TransitionComponent={Zoom}
				classes={{ tooltip: classes.toolTip }}
			>
				<EditIcon onClick={handleOpen} className={classes.buttonIcon} />
				{
					// <button
					// 	type='button'
					// 	onClick={handleOpen}
					// 	className={`btn btn-secondary ${classes.absolute}`}
					// >
					// 	Update Task
					// </button>
				}
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
						{false ? (
							<LoadingImg />
						) : (
							<form onSubmit={onSubmit}>
								<div className='form-group'>
									<input
										type='text'
										className={classnames(
											"form-control form-control-lg",
											{
												"is-invalid": errors.summary
											}
										)}
										name='summary'
										placeholder='Project Task summary'
										value={taskDetails.summary}
										onChange={onChange}
									/>
									{errors.summary && (
										<div className='invalid-feedback'>
											{errors.summary}
										</div>
									)}
								</div>
								<div className='form-group'>
									<textarea
										className='form-control form-control-lg'
										placeholder='Acceptance Criteria'
										name='acceptanceCriteria'
										value={taskDetails.acceptanceCriteria}
										onChange={onChange}
									/>
								</div>
								<h6>Due Date</h6>
								<div className='form-group'>
									<input
										type='date'
										className={classnames(
											"form-control form-control-lg",
											{
												"is-invalid": errors.dueDate
											}
										)}
										name='dueDate'
										value={taskDetails.dueDate}
										onChange={onChange}
									/>
									{errors.dueDate && (
										<div className='invalid-feedback'>
											{errors.dueDate}
										</div>
									)}
								</div>
								<div className='form-group'>
									<select
										className='form-control form-control-lg'
										name='priority'
										value={taskDetails.priority}
										onChange={onChange}
									>
										<option value={0}>
											Select Priority
										</option>
										<option value={1}>High</option>
										<option value={2}>Medium</option>
										<option value={3}>Low</option>
									</select>
								</div>
								<div className='form-group'>
									<select
										className='form-control form-control-lg'
										name='status'
										value={taskDetails.status}
										onChange={onChange}
										disabled={taskDetails.available != true}
									>
										<option value=''>Select Status</option>
										<option value='TO_DO'>TO DO</option>
										<option value='IN_PROGRESS'>
											IN PROGRESS
										</option>
										<option value='DONE'>DONE</option>
									</select>
								</div>
								<button
									type='submit'
									className='btn btn-primary btn-block mt-4'
									disabled={disableSave}
								>
									save
								</button>
							</form>
						)}
						<button
							onClick={handleClose}
							className='btn btn-primary btn-block mt-4'
						>
							close
						</button>
					</div>
				</Fade>
			</Modal>
		</div>
	)
}

UpdateProjectTask2.propTypes = {
	updateProjectTask: PropTypes.func.isRequired,
	getProjectTask: PropTypes.func.isRequired,
	errors: PropTypes.object.isRequired,
	cleanupErrorsState: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
	errors: state.errors,
	project_tasks: state.backlog.project_tasks
})

export default connect(mapStateToProps, {
	getProjectTask,
	updateProjectTask,
	cleanupErrorsState
})(UpdateProjectTask2)
