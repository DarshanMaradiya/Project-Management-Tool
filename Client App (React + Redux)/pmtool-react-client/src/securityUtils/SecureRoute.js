import React from "react"
import PropTypes from "prop-types"
import { Redirect, Route } from "react-router-dom"
import { connect } from "react-redux"

const SecureRoute = ({ component: Component, security, ...otherProps }) => (
	<Route
		{...otherProps}
		render={(props) =>
			security.validToken === true ? (
				<Component {...props} />
			) : (
				<Redirect to='/' />
			)
		}
	/>
)

SecureRoute.propTypes = {
	security: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
	security: state.security
})

export default connect(mapStateToProps, null)(SecureRoute)
