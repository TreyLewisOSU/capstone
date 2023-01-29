import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function RegisteredStudentsInClass() {
    const { classID } = useParams()

    const [students, setStudents] = useState([])

    const URL = 'https://osu-craft-center-capstone-f22.uw.r.appspot.com/'

    const fetchStudents = async () => {
        // GET request using fetch with async/await
        const response = await fetch(URL + 'classes/' + classID + '/students');
        const data = await response.json();
        const students = data

        setStudents(students)
        console.log(classID)
        console.log(students)
    }

    const removeStudentFromClass = async (student_id) => {
        fetch((URL + 'students/' + student_id + '/classes/' + classID), {
            method: "DELETE"})
        const newStudents = students.filter(
            (student) => student.id !== student_id
        )
        setStudents(newStudents)
    }

    useEffect(() => {
        fetchStudents()
    }, [])

    return (
        <>
            <h1>These are the students in class {classID}</h1>
            <table>
                <thead>
                    <tr>
                        <th>Student ID:</th>
                        <th>Student Name:</th>
                        <th>Remove Student From Class</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td>{student.id}</td>
                            <td>{student.name}</td>
                            <td>
                                <button onClick={() => removeStudentFromClass(student.id)}>
                                    Remove Me From Class!
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default RegisteredStudentsInClass