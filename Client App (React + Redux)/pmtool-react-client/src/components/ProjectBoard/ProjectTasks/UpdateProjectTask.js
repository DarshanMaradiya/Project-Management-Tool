import React, { Component } from "react"
import { Link } from "react-router-dom"
import { deepCompare } from "../../../UDFs"
import classnames from "classnames"
import { PropTypes } from "prop-types"
import { connect } from "react-redux"
import {
	updateProjectTask,
	getProjectTask
} from "../../../actions/backlogActions"
import { cleanupErrorsState } from "../../../actions/errorsActions"

class UpdateProjectTask extends Component {
	constructor(props) {
		super(props)
		const { backlog_id, projectTask_id } = this.props.match.params

		this.state = {
			id: "",
			summary: "",
			projectSequence: projectTask_id,
			acceptanceCriteria: "",
			status: "",
			priority: 0,
			dueDate: "",
			projectIdentifier: backlog_id,
			assignee: {},
			create_At: "",
			errors: {}
		}
	}

	componentWillUnmount() {
		this.props.cleanupErrorsState()
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		// errors
		if (!deepCompare(prevState.errors, nextProps.errors)) {
			return {
				errors: nextProps.errors
			}
		}
		// project_task
		if (
			prevState.id != nextProps.project_task.id &&
			!deepCompare(prevState, nextProps.project_task)
		) {
			return { ...nextProps.project_task }
		}
		return null
	}

	componentDidMount() {
		const { backlog_id, projectTask_id } = this.props.match.params
		this.props.getProjectTask(
			backlog_id,
			projectTask_id,
			this.props.history
		)
	}

	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		})
	}

	onSubmit = (e) => {
		e.preventDefault()
		const updatedTask = {
			id: this.state.id,
			projectSequence: this.state.projectSequence,
			projectIdentifier: this.state.projectIdentifier,
			summary: this.state.summary,
			acceptanceCriteria: this.state.acceptanceCriteria,
			status: this.state.status,
			priority: this.state.priority,
			assignee: this.state.assignee,
			dueDate: this.state.dueDate,
			create_At: this.state.create_At
		}
		// console.log(updatedTask)
		this.props.updateProjectTask(
			this.state.projectIdentifier,
			updatedTask,
			this.props.history
		)
	}

	render() {
		const { backlog_id } = this.props.match.params
		const { errors } = this.state

		return (
			<div className='add-PBI'>
				<div className='container'>
					<div className='row'>
						<div className='col-md-8 m-auto'>
							<Link
								to={`/projectBoard/${backlog_id}`}
								className='btn btn-light'
							>
								Back to Project Board
							</Link>
							<h4 className='display-4 text-center'>
								Update Project Task
							</h4>
							<p className='lead text-center'>
								Project Name: {this.state.projectIdentifier} +
								Project Task ID: {this.state.projectSequence}
							</p>
							<form onSubmit={this.onSubmit}>
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
										value={this.state.summary}
										onChange={this.onChange}
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
										value={this.state.acceptanceCriteria}
										onChange={this.onChange}
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
										value={this.state.dueDate}
										onChange={this.onChange}
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
										value={this.state.priority}
										onChange={this.onChange}
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
										value={this.state.status}
										onChange={this.onChange}
									>
										<option value=''>Select Status</option>
										<option value='TO_DO'>TO DO</option>
										<option value='IN_PROGRESS'>
											IN PROGRESS
										</option>
										<option value='DONE'>DONE</option>
									</select>
								</div>

								<input
									type='submit'
									className='btn btn-primary btn-block mt-4'
								/>
							</form>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

UpdateProjectTask.propTypes = {
	updateProjectTask: PropTypes.func.isRequired,
	getProjectTask: PropTypes.func.isRequired,
	project_task: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	cleanupErrorsState: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
	errors: state.errors,
	project_task: state.backlog.project_task
})

export default connect(mapStateToProps, {
	getProjectTask,
	updateProjectTask,
	cleanupErrorsState
})(UpdateProjectTask)
