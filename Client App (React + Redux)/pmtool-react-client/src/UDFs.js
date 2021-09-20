import Backlog from "./components/ProjectBoard/Backlog"

export const deepCompare = (obj1, obj2) => {
	var i, l, leftChain, rightChain

	function compare2Objects(x, y) {
		var p

		// remember that NaN === NaN returns false
		// and isNaN(undefined) returns true
		if (
			isNaN(x) &&
			isNaN(y) &&
			typeof x === "number" &&
			typeof y === "number"
		) {
			return true
		}

		// Compare primitives and functions.
		// Check if both arguments link to the same object.
		// Especially useful on the step where we compare prototypes
		if (x === y) {
			return true
		}

		// Works in case when functions are created in constructor.
		// Comparing dates is a common scenario. Another built-ins?
		// We can even handle functions passed across iframes
		if (
			(typeof x === "function" && typeof y === "function") ||
			(x instanceof Date && y instanceof Date) ||
			(x instanceof RegExp && y instanceof RegExp) ||
			(x instanceof String && y instanceof String) ||
			(x instanceof Number && y instanceof Number)
		) {
			return x.toString() === y.toString()
		}

		// At last checking prototypes as good as we can
		if (!(x instanceof Object && y instanceof Object)) {
			return false
		}

		if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
			return false
		}

		if (x.constructor !== y.constructor) {
			return false
		}

		if (x.prototype !== y.prototype) {
			return false
		}

		// Check for infinitive linking loops
		if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
			return false
		}

		// Quick checking of one object being a subset of another.
		// todo: cache the structure of arguments[0] for performance
		for (p in y) {
			if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
				return false
			} else if (typeof y[p] !== typeof x[p]) {
				return false
			}
		}

		for (p in x) {
			if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
				return false
			} else if (typeof y[p] !== typeof x[p]) {
				return false
			}

			switch (typeof x[p]) {
				case "object":
				case "function":
					leftChain.push(x)
					rightChain.push(y)

					if (!compare2Objects(x[p], y[p])) {
						return false
					}

					leftChain.pop()
					rightChain.pop()
					break

				default:
					if (x[p] !== y[p]) {
						return false
					}
					break
			}
		}

		return true
	}

	if (obj1 == null || obj2 == null) {
		return true //Die silently? Don't know how to handle such case, please help...
		// throw "Need two arguments to compare";
	}

	for (i = 1, l = 2; i < l; i++) {
		leftChain = [] //Todo: this can be cached
		rightChain = []

		if (!compare2Objects(obj1, obj2)) {
			return false
		}
	}

	return true
}

export const boardAlgorithm = (errors, project_tasks) => {
	let BoardContent, project_found

	if (errors.projectNotFound) {
		BoardContent = (
			<div className='alert alert-danger text-center' role='alert'>
				{errors.projectNotFound}
			</div>
		)
		project_found = false
	} else if (errors.projectIdentifier) {
		BoardContent = (
			<div className='alert alert-danger text-center' role='alert'>
				{errors.projectIdentifier}
			</div>
		)
		project_found = false
	} else {
		if (project_tasks.length < 1) {
			BoardContent = (
				<div className='alert alert-info text-center' role='alert'>
					No Project Tasks on this board
				</div>
			)
		} else {
			BoardContent = <Backlog project_tasks_prop={project_tasks} />
		}
		project_found = true
	}
	return [BoardContent, project_found]
}

export const getUrlParameter = (url, name) => {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)")

	var results = regex.exec(url)
	return results === null
		? ""
		: decodeURIComponent(results[1].replace(/\+/g, " "))
}
export const sendMail = (emailRequest) => ({
	requestURL: "/api/email/",
	requestMethod: "POST",
	requestPayload: emailRequest
})

export const getUniqueAlphaNumericCode = () => {
	return (
		new Date().getTime().toString(36) +
		Math.floor(Math.random() * 1000).toString(36)
	)
}

export const getMailVerificationCode = () => {
	let verificationCode = localStorage.getItem("verificationCode")
	if (verificationCode != undefined) return verificationCode
	else {
		verificationCode = getUniqueAlphaNumericCode()
		localStorage.setItem("verificationCode", verificationCode)
		return verificationCode
	}
}
