import React, { Component } from "react";

export default class AddClassForm extends Component {
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event){ 
        event.preventDefault();
        alert("Your class is being added. Please click the classes button to see your new class")
        fetch('https://garzacao-capstone.uc.r.appspot.com/classes', {
            method: 'post',
            headers: {'Content-Type':'application/json', "Access-Control-Allow-Origin": "*"},
            body: JSON.stringify({
                "name": this.name.value,
                "description": this.description.value,
                "price": this.price.value,
                "member_price": this.member_price.value,
                "teacher": this.teacher.value,
                "datetime": this.datetime.value,
                "capacity": this.capacity.value
                })
            }
        );
    };
   
    render () {
        return (
            <div id="add class">
            <h1>Add a Class:</h1>
            <form onSubmit={this.handleSubmit}>
                <input ref={(ref) => {this.name = ref}} placeholder="Class Name" type="text" name="name"/><br />
                <input ref={(ref) => {this.description = ref}} placeholder="Class Description" type="text" name="description"/><br />
                <input ref={(ref) => {this.price = ref}} placeholder="Price" type="int" name="price"/><br />
                <input ref={(ref) => {this.member_price = ref}} placeholder="Member Price" type="int" name="member_price"/><br />
                <input ref={(ref) => {this.teacher = ref}} placeholder="Class Teacher" type="text" name="teacher"/><br />
                <input ref={(ref) => {this.datetime = ref}} placeholder="datetime" type="text" name="datetime"/><br />
                <input ref={(ref) => {this.capacity = ref}} placeholder="Capacity" type="text" name="capacity"/><br />
                <button type="Submit">Add Class</button>
            </form>
            </div>
            )
        }
}