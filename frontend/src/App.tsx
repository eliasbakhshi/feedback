import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import Registration from './pages/registration';
import LoginPage from './pages/loginPage.tsx';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/registration" element={<Registration />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </Router>
    );
};

export default App;
