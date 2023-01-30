import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"

function AddStudentToClass() {
    const { studentID } = useParams()
    const [classes, setClasses] = useState([])
    const [nameClass, setNameClass] = useState([])

    // const navigate = useNavigate()
    const URL = 'https://garzacao-capstone.uc.r.appspot.com/classes'
    const URL_put = 'https://garzacao-capstone.uc.r.appspot.com/students'

    const fetchClasses = async () => {
        // GET request using fetch with async/await
        const response = await fetch(URL);
        const data = await response.json();
        const classes = data

        setClasses(classes.classes)
        console.log(classes.classes)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        fetch((URL_put + studentID + '/classes/' + nameClass), {
            method: "PUT"})
        alert(`${studentID} has Registered for class ID: ${nameClass}`)
    }

    useEffect(() => {
        fetchClasses()
    }, [])

    return (
        <>
            <h1>Which Class Would You (ID: {studentID}) Like to Register For?</h1>
            <form onSubmit={handleSubmit}>
                <select name="classSelection" id="classes Selection" onChange={(e) => setNameClass(e.target.value)}>
                    <option key="" value="">---SELECT CLASS---</option>
                    {classes.map(data => (
                        <option key={data.id} value={data.id}>
                            {data.name}
                        </option>
                    ))}
                </select>
                <input type="submit" />
            </form>
        </>
    )
}

export default AddStudentToClass