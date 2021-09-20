import React, { Component } from 'react'
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { getProject, updateProject } from '../../actions/projectActions'
import { deepCompare } from '../../UDFs';
import classnames from 'classnames'
import { cleanupErrorsState } from "../../actions/errorsActions"

class UpdateProject extends Component {
    constructor() {
        super()
    
        this.state = {
            projectName: "",
            projectIdentifier: "",
            description: "",
            start_date: "",
            end_date: "",
            projectLeader: "",
            team: "",
            errors: {}
        }
    }

    componentWillUnmount() {
        this.props.cleanupErrorsState()
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit = (e) => {
        e.preventDefault()
        const updatedProject = {
            id: this.state.id,
            projectName: this.state.projectName,
            projectIdentifier: this.state.projectIdentifier,
            description: this.state.description,
            start_date: this.state.start_date,
            end_date: this.state.end_date,
            projectLeader: this.state.projectLeader,
            team: this.state.team
        }
        this.props.updateProject(updatedProject, this.props.history)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // console.log('called')
        // console.log(prevState, nextProps.project)

        if (!deepCompare(prevState.errors, nextProps.errors)) {
            return ({ errors: nextProps.errors }) // <- this is setState equivalent
        }

        // Jugaaad
        if (prevState.id != nextProps.project.id && !deepCompare(prevState, nextProps.project)) {
            // console.log('reached')
          return ({ ...nextProps.project }) // <- this is setState equivalent
        }
        return null
    }
    
    componentDidMount() {
        const { id } = this.props.match.params
        this.props.getProject(id, this.props.history)
        // this.props.getProject(id, this.props.history, this.props.projects)
    }

    render() {
        const { errors } = this.state
        return (
            <div className="project">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h5 className="display-4 text-center">Update Project form</h5>
                            <hr />
                            <form onSubmit={ this.onSubmit }>
                                <div className="form-group">
                                    <input 
                                        type="text" 
                                        className={ classnames("form-control form-control-lg ", {
                                            "is-invalid": errors.projectName
                                        }) }
                                        placeholder="Project Name" 
                                        name="projectName"
                                        value={ this.state.projectName }
                                        onChange={ this.onChange }
                                    />
                                    {
                                        errors.projectName && (
                                            <div className="invalid-feedback">{ errors.projectName }</div>
                                        )
                                    }
                                </div>
                                <div className="form-group">
                                    <input 
                                        type="text" 
                                        className={ classnames("form-control form-control-lg ", {
                                            "is-invalid": errors.projectIdentifier
                                        }) }
                                        placeholder="Unique Project ID" 
                                        name="projectIdentifier"
                                        value={ this.state.projectIdentifier }
                                        disabled 
                                    />
                                    {
                                        errors.projectIdentifier && (
                                            <div className="invalid-feedback">{ errors.projectIdentifier }</div>
                                        )
                                    }
                                </div>
                                <div className="form-group">
                                    <textarea 
                                        className={ classnames("form-control form-control-lg ", {
                                            "is-invalid": errors.description
                                        }) }
                                        placeholder="Project Description"
                                        name="description"
                                        value={ this.state.description }
                                        onChange={ this.onChange }
                                    />
                                    {
                                        errors.description && (
                                            <div className="invalid-feedback">{ errors.description }</div>
                                        )
                                    }
                                </div>
                                <h6>Start Date</h6>
                                <div className="form-group">
                                    <input 
                                        type="date" 
                                        className={ classnames("form-control form-control-lg ", {
                                            "is-invalid": errors.start_date
                                        }) } 
                                        name="start_date" 
                                        value={ this.state.start_date }
                                        onChange={ this.onChange }
                                    />
                                    {
                                        errors.start_date && (
                                            <div className="invalid-feedback">{ errors.start_date }</div>
                                        )
                                    }
                                </div>
                                <h6>Estimated End Date</h6>
                                <div className="form-group">
                                    <input 
                                        type="date" 
                                        className={ classnames("form-control form-control-lg ", {
                                            "is-invalid": errors.end_date
                                        }) } 
                                        name="end_date" 
                                        value={ this.state.end_date }
                                        onChange={ this.onChange }
                                    />
                                    {
                                        errors.end_date && (
                                            <div className="invalid-feedback">{ errors.end_date }</div>
                                        )
                                    }
                                </div>

                                <input type="submit" className="btn btn-primary btn-block mt-4" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

UpdateProject.propTypes = {
    getProject: PropTypes.func.isRequired,
    updateProject: PropTypes.func.isRequired,
    project: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    cleanupErrorsState: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    projects: state.project.projects,
    project: {
        ...state.project.project
    },
    errors: state.errors
})

export default connect(mapStateToProps, { getProject, updateProject, cleanupErrorsState })(UpdateProject)
