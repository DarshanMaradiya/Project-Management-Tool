import axios from "axios"

const setJWTToken = token => {
    if (token) {
        // setting the token in "Authorization" in header
        axios.defaults.headers.common["Authorization"] = token
    } else {
        delete axios.defaults.headers.common["Authorization"]
    }
}

export default setJWTToken