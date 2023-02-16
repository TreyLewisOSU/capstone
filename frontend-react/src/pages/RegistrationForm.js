import React, { Component } from "react";

export default class RegistrationForm extends Component {
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event){ 
        event.preventDefault();
        alert("Thank you for submitting. OSU Crafter Center will process your registration.")
        fetch('https://garzacao-capstone.uc.r.appspot.com/registrationForm', {
            method: 'post',
            headers: {'Content-Type':'application/json', "Access-Control-Allow-Origin": "*"},
            body: JSON.stringify({
                "name": this.name.value,
                "pronouns": this.pronouns.value,
                "OSUID": this.OSUID.value,
                "phoneNumber": this.phoneNumber.value,
                "streetAddress": this.streetAddress.value,
                "city": this.city.value,
                "state": this.state.value,
                "zipCode": this.zipCode.value
                })
            }
        );
    };
   
    render () {
        return (
            <div id="submit registration">
            <h1>Registration Form:</h1>
            <form onSubmit={this.handleSubmit}>
                <input ref={(ref) => {this.name = ref}} placeholder="Your Name" type="text" name="name"/><br />
                <input ref={(ref) => {this.pronouns = ref}} placeholder="Your Pronouns" type="text" name="pronouns"/><br />
                <input ref={(ref) => {this.OSUID= ref}} placeholder="Current OSU ID Number" type="int" name="OSUID"/><br />
                <input ref={(ref) => {this.phoneNumber = ref}} placeholder="Phone Number" type="int" name="phoneNumber"/><br />
                <input ref={(ref) => {this.streetAddress = ref}} placeholder="Street Address" type="text" name="streetAddress"/><br />
                <input ref={(ref) => {this.city = ref}} placeholder="City" type="text" name="city"/><br />
                <input ref={(ref) => {this.state = ref}} placeholder="State" type="text" name="state"/><br />
                <input ref={(ref) => {this.zipCode = ref}} placeholder="Zip Code" type="text" name="zipCode"/><br />
                <button type="Submit">Submit Registration</button>
            </form>
            </div>
            )
        }
}