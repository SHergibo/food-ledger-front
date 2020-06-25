import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

function SignInOut({history}) {
    return (
        <div>
            test
        </div>
    )
}

SignInOut.propTypes = {
    history: PropTypes.object,
}

export default withRouter(SignInOut);

