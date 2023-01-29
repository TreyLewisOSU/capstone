import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { CSVLink } from 'react-csv';

function ClassPage() {
    const [classes, setClasses] = useState([])

    const navigate = useNavigate()
    const URL = 'https://osu-craft-center-capstone-f22.uw.r.appspot.com/classes'

    const fetchClasses = async () => {
        // GET request using fetch with async/await
        const response = await fetch(URL);
        const data = await response.json();
        const classes = data

        setClasses(classes.classes)
        console.log(classes.classes)
    }

    const deleteClasses = (class_id) => {
        // DELETE request using fetch with async / await
        fetch((URL + '/' + class_id), {
            method: 'DELETE'})
        const newClasses = classes.filter(
            (selected_class) => selected_class.id !== class_id
        )
        setClasses(newClasses)
    }

    useEffect(() => {
        fetchClasses()
    }, [])

    const findRegisteredStudents = (class_id) => {
        navigate(`/classes/${class_id}/students`)
    }

    return (
        <>
            <h1>Class Page</h1>
            <h5>
                Hello, this is a list of the current classes
            </h5>
            <p>
                <CSVLink data={classes}>Download the Table</CSVLink>
            </p>
            <table>
                <thead>
                    <tr>
                        <th>Class ID:</th>
                        <th>Class Name:</th>
                        <th>Class Teacher:</th>
                        <th>Class Time</th>
                        <th>Description</th>
                        <th>Member Price</th>
                        <th>Price</th>
                        <th>Number of Students</th>
                        <th>View Students:</th>
                        <th>Delete Class?</th>
                    </tr>
                </thead>
                <tbody>
                    {classes.map((selected_class) => (
                        <tr key={selected_class.id}>
                            <td>{selected_class.id}</td>
                            <td>{selected_class.name}</td>
                            <td>{selected_class.teacher}</td>
                            <td>{selected_class.datetime}</td>
                            <td>{selected_class.description}</td>
                            <td>{selected_class.member_price}</td>
                            <td>{selected_class.price}</td>
                            <td>{selected_class.students.length}</td>
                            <td>
                                <button onClick={() => findRegisteredStudents(selected_class.id)}>
                                    View Registered Students
                                </button>
                            </td>
                            <td>
                                <button onClick={() => deleteClasses(selected_class.id)}>
                                    Delete Me!
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p>
                <a href='/classAdd'>Add a class</a>
            </p>
        </>
    )
}

export default ClassPage