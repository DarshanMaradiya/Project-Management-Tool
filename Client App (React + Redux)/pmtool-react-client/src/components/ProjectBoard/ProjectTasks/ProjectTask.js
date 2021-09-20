import React, { Component } from "react"
import { Link } from "react-router-dom"
import { approveTask, deleteProjectTask } from "../../../actions/backlogActions"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import AssignTask from "./AssignTask"
import UpdateProjectTask2 from "./UpdateProjectTask2"
import ManageDependencies from "./ManageDependencies"
import ThumbUpIcon from "@material-ui/icons/ThumbUp"
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn"
import { makeStyles, Tooltip, Zoom } from "@material-ui/core"
import DeleteIcon from "@material-ui/icons/Delete"
import classnames from "classnames"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"

const useStyle = makeStyles((theme) => ({
	task: {
		// width: "100%"
	},
	taskDetails: { width: "100%" },
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
	operationTray: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%"
	},
	taskOperations: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-start"
	},
	assigneeOperations: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-start"
	}
}))

const ProjectTask = (props) => {
	const classes = useStyle()

	const { project_task } = props
	const backlog_id = project_task.projectIdentifier
	const projectTask_id = project_task.projectSequence
	const assignee = project_task.assignee

	let priorityString
	let priorityClass

	if (project_task.priority === 1) {
		priorityClass = "bg-danger text-light"
		priorityString = "HIGH"
	} else if (project_task.priority === 2) {
		priorityClass = "bg-warning text-light"
		priorityString = "MEDIUM"
	} else if (project_task.priority === 3) {
		priorityClass = "bg-info text-light"
		priorityString = "LOW"
	}

	const onDelete = (backlog_id, projectTask_id) => {
		props.deleteProjectTask(backlog_id, projectTask_id)
	}

	const handleApprove = (backlog_id, projectTask_id, approval) => {
		const confirmation = window.confirm(
			approval
				? "Are you sure you want to approve this task?"
				: "Are you sure you want to take back the approval of this task?"
		)
		if (confirmation)
			props.approveTask(backlog_id, projectTask_id, approval)
	}

	return (
		<div className={classnames("card mb-1 bg-light", classes.Task)}>
			<div className={`card-header text-primary ${priorityClass}`}>
				ID: {project_task.projectSequence} -- Priority: {priorityString}
			</div>
			<div
				className={classnames(
					"card-body bg-light",
					classes.taskDetails
				)}
			>
				<h5 className='card-title'>{project_task.summary}</h5>
				<p className='card-text text-truncate '>
					{project_task.acceptanceCriteria}
				</p>
				<div className={classes.operationTray}>
					<div className={classes.taskOperations}>
						{project_task.approved == false && (
							<ManageDependencies
								projectSequence={project_task.projectSequence}
								projectIdentifier={backlog_id}
							/>
						)}
						{project_task.approved == false && (
							<UpdateProjectTask2
								projectSequence={project_task.projectSequence}
								projectIdentifier={backlog_id}
							/>
						)}
						<Tooltip
							title='Delete Task'
							placement='bottom'
							TransitionComponent={Zoom}
							classes={{ tooltip: classes.toolTip }}
						>
							<DeleteIcon
								onClick={() =>
									onDelete(backlog_id, projectTask_id)
								}
								className={classes.buttonIcon}
							/>
						</Tooltip>
					</div>
					<div className={classes.assigneeOperations}>
						{project_task.approved == false && (
							<AssignTask
								projectTask_id={projectTask_id}
								backlog_id={backlog_id}
								assignee={assignee}
							/>
						)}
						{project_task.status === "DONE" &&
							(project_task.approved == false ? (
								<Tooltip
									title='Approve/Disaaprove'
									placement='bottom'
									TransitionComponent={Zoom}
									classes={{ tooltip: classes.toolTip }}
								>
									<AssignmentTurnedInIcon
										onClick={() =>
											handleApprove(
												backlog_id,
												projectTask_id,
												true
											)
										}
										className={classes.buttonIcon}
									/>
								</Tooltip>
							) : (
								<Tooltip
									title='Approved'
									placement='bottom'
									TransitionComponent={Zoom}
									classes={{ tooltip: classes.toolTip }}
								>
									<CheckCircleIcon
										onClick={() =>
											handleApprove(
												backlog_id,
												projectTask_id,
												false
											)
										}
										className={classes.buttonIcon}
									/>
								</Tooltip>
								// <button
								// onClick={() =>
								// 	handleApprove(
								// 		backlog_id,
								// 		projectTask_id,
								// 		false
								// 	)
								// }
								// 	className='btn btn-secondary'
								// >
								// 	Remove Approval
								// </button>
							))}
					</div>
				</div>

				{
					// <Link
					// 	to={`/updateProjectTask/${project_task.projectIdentifier}/${project_task.projectSequence}`}
					// 	className='btn btn-primary'
					// >
					// 	View / Update
					// </Link>
				}

				{
					// <button
					// 	onClick={() => onDelete(backlog_id, projectTask_id)}
					// 	className='btn btn-danger'
					// >
					// 	Delete
					// </button>
				}
			</div>
		</div>
	)
}

ProjectTask.propTypes = {
	deleteProjectTask: PropTypes.func.isRequired
}

export default connect(null, { deleteProjectTask, approveTask })(ProjectTask)
