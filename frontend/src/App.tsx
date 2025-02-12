import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import Registration from './pages/registration';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/registration" element={<Registration />} />
            </Routes>
        </Router>
    );
};

export default App;
