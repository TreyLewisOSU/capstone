import React, { Component } from "react"

export default class EditStudentForm extends Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(event) {
        event.preventDefault()
        alert("Your student has just been edited. Please click the students button to see your new student")
        fetch('https://garzacao-capstone.uc.r.appspot.com/students', {
            method: 'patch',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                "OSUID": this.osuid.value,
                "name": this.name.value,
                "email": this.email.value
            })
        })
    }

    render() {
        return (
            <div id="edit student">
                <h1>Edit a Student:</h1>
                <form onSubmit={this.handleSubmit}>
                    <input ref={(ref) => {this.osuid = ref}} placeholder="OSUID" type="text" name="osuid"/><br />
                    <input ref={(ref) => {this.name = ref}} placeholder="Name" type="text" name="name"/><br />
                    <input ref={(ref) => {this.email = ref}} placeholder="Email" type="text" name="email"/><br />
                    <button type="Submit">Edit Student</button>
                </form>
            </div>
        )
    }
}