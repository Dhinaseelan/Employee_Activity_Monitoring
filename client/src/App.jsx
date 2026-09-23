import './App.css';
import './design-system.css';
import AdminRoot from './Root/Root';
import 'bootstrap/dist/css/bootstrap.min.css';
import ManagerRoot from './Root/RootTwo';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserRoot from './Root/RootThree';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route
                        path="/*"
                        element={
                            <>
                                <AdminRoot />
                                <ManagerRoot />
                                <UserRoot />
                            </>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
