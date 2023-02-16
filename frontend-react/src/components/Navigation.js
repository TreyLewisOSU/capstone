import React from "react"

function Navigation() {
    return (
        <nav className="navbar navbar-light bg-light">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">Home</a>
            <a className="navbar-brand" href="/classes">Classes</a>
            <a className="navbar-brand" href="/students">Students</a>
            <a className="navbar-brand" href="/registrationForm">Registration Form</a>
          </div>
        </nav>
    )
}

export default Navigation