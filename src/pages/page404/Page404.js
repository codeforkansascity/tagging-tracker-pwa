import React from 'react';
import { Link } from 'react-router-dom';
import './Page404.scss';

const Page404 = (props) => {
    return (
        <div className="tagging-tracker__page-404">
            <h2>You've entered an invalid path</h2>
            <p>Try the page(s) below to return to the app</p>
            <Link to="/">Login</Link>
        </div>
    )
}

export default Page404;