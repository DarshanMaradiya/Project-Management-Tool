import React, { Component } from "react"
import { connect } from "react-redux"
import { createNewUser } from "../../actions/SecurityActions"
import PropTypes from "prop-types"
import { deepCompare } from "../../UDFs"
import classnames from "classnames"
import { cleanupErrorsState } from "../../actions/errorsActions"

class Register extends Component {
	constructor(props) {
		super(props)

		this.state = {
			username: "",
			fullname: "",
			password: "",
			confirmPassword: "",
			provider: "local",
			errors: {}
		}
	}

	componentDidMount() {
		if (this.props.security.validToken) {
			this.props.history.push("/dashboard")
		}
	}

	componentWillUnmount() {
		this.props.cleanupErrorsState()
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (!deepCompare(nextProps.errors, prevState.errors)) {
			return { errors: nextProps.errors }
		}
		return null
	}

	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		})
	}

	onSubmit = (e) => {
		e.preventDefault()
		const newUser = {
			username: this.state.username,
			fullname: this.state.fullname,
			password: this.state.password,
			confirmPassword: this.state.confirmPassword,
			provider: this.state.provider
		}
		this.props.createNewUser(newUser, this.props.history)
	}

	render() {
		const { errors } = this.state
		return (
			<div className='register'>
				<div className='container'>
					<div className='row'>
						<div className='col-md-8 m-auto'>
							<h1 className='display-4 text-center'>Sign Up</h1>
							<p className='lead text-center'>
								Create your Account
							</p>
							<form onSubmit={this.onSubmit}>
								<div className='form-group'>
									<input
										type='text'
										className={classnames(
											"form-control form-control-lg",
											{ "is-invalid": errors.fullname }
										)}
										placeholder='Full Name'
										name='fullname'
										value={this.state.fullname}
										onChange={this.onChange}
									/>
									{errors.fullname && (
										<div className='invalid-feedback'>
											{errors.fullname}
										</div>
									)}
								</div>
								<div className='form-group'>
									<input
										type='text'
										className={classnames(
											"form-control form-control-lg",
											{ "is-invalid": errors.username }
										)}
										placeholder='Email Address (Username)'
										name='username'
										value={this.state.username}
										onChange={this.onChange}
									/>
									{errors.username && (
										<div className='invalid-feedback'>
											{errors.username}
										</div>
									)}
								</div>
								<div className='form-group'>
									<input
										type='password'
										className={classnames(
											"form-control form-control-lg",
											{ "is-invalid": errors.password }
										)}
										placeholder='Password'
										name='password'
										value={this.state.password}
										onChange={this.onChange}
									/>
									{errors.password && (
										<div className='invalid-feedback'>
											{errors.password}
										</div>
									)}
								</div>
								<div className='form-group'>
									<input
										type='password'
										className={classnames(
											"form-control form-control-lg",
											{
												"is-invalid":
													errors.confirmPassword
											}
										)}
										placeholder='Confirm Password'
										name='confirmPassword'
										value={this.state.confirmPassword}
										onChange={this.onChange}
									/>
									{errors.confirmPassword && (
										<div className='invalid-feedback'>
											{errors.confirmPassword}
										</div>
									)}
								</div>
								<input
									type='submit'
									className='btn btn-info btn-block mt-4'
								/>
							</form>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

Register.propTypes = {
	createNewUser: PropTypes.func.isRequired,
	errors: PropTypes.object.isRequired,
	security: PropTypes.object.isRequired,
	cleanupErrorsState: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
	errors: { ...state.errors },
	security: state.security
})

export default connect(mapStateToProps, { createNewUser, cleanupErrorsState })(
	Register
)
