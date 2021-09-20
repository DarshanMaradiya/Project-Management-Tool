import React, { Component } from "react"
import ProjectTask from "./ProjectTasks/ProjectTask"

class Backlog extends Component {
	render() {
		const { project_tasks_prop } = this.props
		const tasks = project_tasks_prop.map((project_task) => (
			<ProjectTask key={project_task.id} project_task={project_task} />
		))
		let todoItems = []
		let inProgressItems = []
		let doneItems = []
		let approvedItems = []

		project_tasks_prop.forEach((task) => {
			switch (task.status) {
				case "TO_DO":
					todoItems.push(
						<ProjectTask key={task.id} project_task={task} />
					)
					break
				case "IN_PROGRESS":
					inProgressItems.push(
						<ProjectTask key={task.id} project_task={task} />
					)
					break
				case "DONE":
					if (task.approved)
						approvedItems.push(
							<ProjectTask key={task.id} project_task={task} />
						)
					else
						doneItems.push(
							<ProjectTask key={task.id} project_task={task} />
						)
					break
			}
		})

		return (
			<div className='container'>
				<div className='row'>
					<div className='col-md-3'>
						<div className='card text-center mb-2'>
							<div className='card-header bg-secondary text-white'>
								<h3>TO DO</h3>
							</div>
						</div>

						{todoItems}
					</div>
					<div className='col-md-3'>
						<div className='card text-center mb-2'>
							<div className='card-header bg-primary text-white'>
								<h3>In Progress</h3>
							</div>
						</div>

						{inProgressItems}
					</div>
					<div className='col-md-3'>
						<div className='card text-center mb-2'>
							<div className='card-header bg-success text-white'>
								<h3>Done</h3>
							</div>
						</div>

						{doneItems}
					</div>
					<div className='col-md-3'>
						<div className='card text-center mb-2'>
							<div className='card-header bg-warning text-white'>
								<h3>Approved</h3>
							</div>
						</div>

						{approvedItems}
					</div>
				</div>
			</div>
		)
	}
}

export default Backlog
