import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { CSVLink } from 'react-csv';

function StudentPage() {
    const [students, setStudents] = useState([])

    const navigate = useNavigate()
    const URL = 'https://osu-craft-center-capstone-f22.uw.r.appspot.com/students'

    const fetchStudents = async () => {
        // GET request using fetch with async/await
        const response = await fetch(URL);
        const data = await response.json();
        const students = data
        setStudents(students)
        console.log(students)
    }


    const deleteStudents = (student_id) => {
        fetch((URL + '/' + student_id), {
            method: "DELETE"})
        const newStudents = students.filter(
            (student) => student.id !== student_id
        )
        setStudents(newStudents)
    }

    const addWinterMembership = (student_id) => {
        fetch((URL + '/' + student_id + '/membership'), {
            method: "PUT",
            headers: {'Content-Type':'application/json', "Access-Control-Allow-Origin": "*"},
            body: JSON.stringify({"term":"Wi2022"})
        })
        
        window.location.reload(false);
    }

    useEffect(() => {
        fetchStudents()
    }, [])

    const registerStudentForClass = (student_id) => {
        navigate(`/students/${student_id}/class`)
    }

    return (
        <>
            <h1>Student Page</h1>
            <p>
                List of students
            </p>
            <p>
                <CSVLink data={students}>Download the Table</CSVLink>
            </p>
            <table>
                <thead>
                    <tr>
                        <th>OSU ID:</th>
                        <th>Student Name:</th>
                        <th>Student Email:</th>
                        <th>Membership(s)</th>
                        <th>Classes Taken</th>
                        <th>Add Membership:</th>
                        <th>Add to Class:</th>
                        <th>Delete Class?</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td>{student.OSUID}</td>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.membership.length}: {student.membership}</td>
                            <td>{student.classes_taken.length}</td> 
                            <td>
                                <button onClick={() => addWinterMembership(student.id)}>
                                    Add Winter 2022 Membership
                                </button>
                            </td>
                            <td>
 
                                <button onClick={() => registerStudentForClass(student.id)}>
                                    Add a Class
                                </button>
                            </td>
                            <td>
                                <button onClick={() => deleteStudents(student.id)}>
                                    Delete Me!
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p>
                <a href="/studentAdd">Add a student</a>
            </p>
        </>
    )
}

export default StudentPage