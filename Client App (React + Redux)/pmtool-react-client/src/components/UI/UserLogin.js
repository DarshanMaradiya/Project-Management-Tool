import { TextField } from '@material-ui/core';
import React from 'react'
import useStyles from '../../hooks/useStyles';

function UserLogin() {
    const classes = useStyles();

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-8 m-auto">
                    <form className={classes.root} noValidate autoComplete="off">
                        <div className="form-group">
                            <TextField
                                id="outlined-basic"
                                label="Email Address (Username)"
                                variant="outlined"
                            />
                        </div>
                        <div className="form-group">
                            <TextField
                                id="outlined-password-input"
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                                variant="outlined"
                            />
                        </div>
                        <input type="submit" className="btn btn-info btn-block mt-4" />
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UserLogin
