import React, { useState } from 'react';

const Detect = ({ match }) => {
    return (
        <React.Fragment>

            <h4>{match.params}</h4>
        </React.Fragment>
    )
}

export default Detect;