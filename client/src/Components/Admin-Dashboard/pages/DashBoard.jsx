import React, { useContext } from 'react';
import '../css/dashboard.css';
import { MdDeleteOutline } from 'react-icons/md';
import employ from '../assets/images/emp.png';
import leave from '../assets/images/leave-request-4.png';
import project from '../assets/images/project-cloud-disk.png';
import DataContext from '../../../Context/AdminContext/Datacontext';
import { Link } from 'react-router-dom';

const DashBoard = () => {
    const {
        totalEmployee,
        setNewTask,
        addTask,
        tasks,
        toggleComplete,
        deleteTask,
        newTask,
        totalProjects,
        projectList,
        totalPresent,
    } = useContext(DataContext);

    return (
        <div className="dashboard-page">
            {/* ── Header ── */}
            <div className="dashboard-header">
                <div className="dashboard-header-top">
                    <div>
                        <span className="dashboard-eyebrow">Operations overview</span>
                        <h4>Good morning, Admin</h4>
                        <p className="dashboard-intro">Here is the current picture of your team and workspace.</p>
                    </div>
                    <span className="dashboard-header-tag">— Overview</span>
                </div>
            </div>

            {/* ── Stat Cards ── */}
            <div className="stat-cards">
                <Link to="allemployees" className="stat-card">
                    <div className="stat-icon">
                        <img src={employ} alt="employees" />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Total Employees</span>
                        <h3 className="stat-value">{totalEmployee}</h3>
                    </div>
                    <span className="stat-link">View more →</span>
                </Link>

                <Link to="addproject" className="stat-card">
                    <div className="stat-icon">
                        <img src={project} alt="projects" />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Total Projects</span>
                        <h3 className="stat-value">{totalProjects}</h3>
                    </div>
                    <span className="stat-link">View more →</span>
                </Link>

                <Link to="attendance" className="stat-card">
                    <div className="stat-icon">
                        <img src={leave} alt="attendance" />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Total Present</span>
                        <h3 className="stat-value">{totalPresent}</h3>
                    </div>
                    <span className="stat-link">View more →</span>
                </Link>

                <Link to="all-meeting-room" className="stat-card">
                    <div className="stat-icon">
                        <img src={project} alt="rooms" />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Booked Rooms</span>
                        <h3 className="stat-value">—</h3>
                    </div>
                    <span className="stat-link">View more →</span>
                </Link>
            </div>

            {/* ── Bottom Section ── */}
            <div className="dashboard-bottom">
                {/* ── Project Table ── */}
                <div className="dash-table-panel">
                    <div className="dash-table-header">
                        <h5>Project List</h5>
                        <span className="dash-count">
                            {projectList.length} projects
                        </span>
                    </div>
                    <div className="dash-table-wrapper">
                        <table className="dash-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Project Title</th>
                                    <th>Manager</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projectList.length > 0 ? (
                                    projectList.map((each, index) => (
                                        <tr key={each._id}>
                                            <td className="td-index">
                                                {index + 1}
                                            </td>
                                            <td className="td-title">
                                                {each.project_title}
                                            </td>
                                            <td>{each.project_employee}</td>
                                            <td>
                                                {new Date(
                                                    each.project_start_date,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td>
                                                {new Date(
                                                    each.project_end_date,
                                                ).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="td-empty">
                                            No projects added yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── To-Do ── */}
                <div className="todo-panel">
                    <div className="todo-panel-header">
                        <h5>To-Do List</h5>
                    </div>

                    <div className="todo-input-row">
                        <input
                            type="text"
                            value={newTask}
                            placeholder="Add a new task..."
                            onChange={(e) => setNewTask(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addTask()}
                        />
                        <button onClick={addTask} className="todo-add-btn">
                            Add
                        </button>
                    </div>

                    <ul className="todo-list">
                        {tasks.length > 0 ? (
                            tasks.map((task) => (
                                <li
                                    key={task.id}
                                    className={`todo-item ${task.completed ? 'completed' : ''}`}
                                >
                                    <span
                                        className="todo-text"
                                        onClick={() => toggleComplete(task.id)}
                                    >
                                        {task.text}
                                    </span>
                                    <button
                                        className="todo-delete"
                                        onClick={() => deleteTask(task.id)}
                                    >
                                        <MdDeleteOutline />
                                    </button>
                                </li>
                            ))
                        ) : (
                            <li className="todo-empty">
                                No tasks yet. Add one above.
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;
