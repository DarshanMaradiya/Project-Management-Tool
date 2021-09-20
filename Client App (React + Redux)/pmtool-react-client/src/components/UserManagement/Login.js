import React, { Component } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { login } from '../../actions/SecurityActions'
import { connect } from 'react-redux'
import { deepCompare } from '../../UDFs'
import { cleanupErrorsState } from '../../actions/errorsActions'

class Login extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            "username": "",
            "password": "",
            "errors": {}
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

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.security.validToken) {
            nextProps.history.push("/dashboard")
        }
        if (!deepCompare(nextProps.errors, prevState.errors)) {
            return ({errors: nextProps.errors})
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
        const LoginRequest = {
            username: this.state.username,
            password: this.state.password
        }
        this.props.login(LoginRequest)
    }
    
    render() {
        const { errors } = this.state

        return (
            <div className="login">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Log In</h1>
                            <form onSubmit={ this.onSubmit }>
                                <div className="form-group">
                                    <input 
                                        type="text" 
                                        className={classnames("form-control form-control-lg",
                                            { "is-invalid": errors.username || errors.invalidLoginResponse})}
                                        placeholder="Email Address (username)" 
                                        name="username"
                                        value={this.state.username}
                                        onChange={this.onChange}
                                    />
                                    {
                                        errors.username && (
                                            <div className="invalid-feedback">{ errors.username }</div>
                                        )
                                    }
                                </div>
                                <div className="form-group">
                                    <input 
                                        type="password" 
                                        className={classnames("form-control form-control-lg",
                                            { "is-invalid": errors.password || errors.invalidLoginResponse})}
                                        placeholder="Password" 
                                        name="password"
                                        value={this.state.password}
                                        onChange={this.onChange}
                                    />
                                    {
                                        errors.password && (
                                            <div className="invalid-feedback">{ errors.password }</div>
                                        )
                                    }
                                    {
                                        errors.invalidLoginResponse && (
                                            <div className="invalid-feedback">{ errors.invalidLoginResponse }</div>
                                        )
                                    }
                                </div>
                                <input type="submit" className="btn btn-info btn-block mt-4" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Login.propTypes = {
    login: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    security: PropTypes.object.isRequired,
    cleanupErrorsState: PropTypes.func.isRequired
}


const mapStateToProps = state => ({
    security: state.security,
    errors: { ...state.errors }
})

export default connect(mapStateToProps, { login, cleanupErrorsState })(Login);