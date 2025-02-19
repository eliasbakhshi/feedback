import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Registration from './pages/registration';

const App: React.FC = () => {
    return (
        <Router>
            <ToastContainer autoClose={3000} position="top-right" />
            <Routes>
                <Route path="/registration" element={<Registration />} />
            </Routes>
        </Router>
    );
};

export default App;
