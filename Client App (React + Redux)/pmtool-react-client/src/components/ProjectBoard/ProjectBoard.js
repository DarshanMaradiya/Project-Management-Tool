import React, { Component } from "react"
import { Link } from "react-router-dom"
import { getBacklog } from "../../actions/backlogActions"
import Backlog from "./Backlog"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { boardAlgorithm, deepCompare } from "../../UDFs"
import { getTeamByProjectIdentifier } from "../../actions/teamActions"

class ProjectBoard extends Component {
	constructor(props) {
		super(props)

		this.state = {
			errors: {}
		}
	}

	static getDerivedStateFromProps = (nextProps, prevState) => {
		if (!deepCompare(nextProps.errors, prevState.errors)) {
			return {
				errors: nextProps.errors
			}
		}
		return null
	}

	componentDidMount() {
		const { id } = this.props.match.params
		this.props.getBacklog(id)
		// this.props.getTeamByProjectIdentifier(id)
	}

	render() {
		const { id } = this.props.match.params
		const { project_tasks } = this.props.backlog
		const { errors } = this.state

		const [BoardContent, project_found] = boardAlgorithm(
			errors,
			project_tasks
		)

		return (
			<div className='container'>
				<Link
					to={
						project_found
							? `/addProjectTask/${id}`
							: `/projectBoard/${id}`
					}
					className='btn btn-primary mb-3'
				>
					<i className='fas fa-plus-circle'> Create Project Task</i>
				</Link>
				<br />
				<hr />
				{BoardContent}
			</div>
		)
	}
}

ProjectBoard.propTypes = {
	backlog: PropTypes.object.isRequired,
	getBacklog: PropTypes.func.isRequired,
	errors: PropTypes.object.isRequired,
	getTeamByProjectIdentifier: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
	backlog: state.backlog,
	errors: {
		...state.errors
	}
})

export default connect(mapStateToProps, {
	getBacklog,
	getTeamByProjectIdentifier
})(ProjectBoard)
