import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Navigation from './components/Navigation'
import StudentPage from './pages/StudentPage';
import ClassPage from './pages/ClassPage';
import AddClassForm from './pages/AddClassPage';
import AddStudentForm from './pages/AddStudentPage';
import RegisteredStudentsInClass from './pages/RegisteredStudentsInClass';
import AddStudentToClass from './pages/AddStudentToClass';
import EditStudentForm from './pages/EditStudentPage'
import EditClassForm from './pages/EditClassPage';
import RegistrationForm from './pages/RegistrationForm';

function App() {
  return (
    <>
      <Router>
        <Navigation />
        <div className="app-body">
            <Routes>
              <Route exact path='/' element={<HomePage/>}></Route>
              <Route path='/registrationForm' element={<RegistrationForm />}></Route>
              <Route path='/students' element={<StudentPage />}></Route>
              <Route path='/studentAdd' element={<AddStudentForm />}></Route>
              <Route path='/editStudent' element={<EditStudentForm />}></Route>
              <Route path='/students/:studentID/class' element={<AddStudentToClass />}></Route>
              <Route path='/classes' element={<ClassPage />}></Route>
              <Route path='/classAdd' element={<AddClassForm />}></Route>
              <Route path='/classEdit' element={<EditClassForm />}></Route>
              <Route path='/classes/:classID/students' element={<RegisteredStudentsInClass />}></Route>
            </Routes>
          </div>
      </Router>
    </>
  );
}

export default App;
