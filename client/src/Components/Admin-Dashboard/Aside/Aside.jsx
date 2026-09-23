import React, { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './aside.css';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { TbLogout2 } from 'react-icons/tb';
import { BsFilePerson, BsCollectionFill } from 'react-icons/bs';
import { FaCalendarAlt } from 'react-icons/fa';
import { RiUserSettingsFill, RiDashboardHorizontalLine } from 'react-icons/ri';
import { RxHamburgerMenu, RxCross2 } from 'react-icons/rx';
import { LuCctv, LuActivity } from 'react-icons/lu';
import AnotherContext from '../../../Context/AdminContext/AnotherContext';

const DashBoard = () => {
    const { dropDown, handleClick, clicked, asideOpen } =
        useContext(AnotherContext);

    return (
        <div className="layout">
            <div className="burger-bar">
                <button className="burger-btn" onClick={handleClick}>
                    <RxHamburgerMenu />
                </button>
            </div>

            {asideOpen && <div className="sidebar-backdrop" onClick={handleClick} />}
            {asideOpen && (
                <button className="sidebar-close-fixed" onClick={handleClick} aria-label="Close sidebar">
                    <RxCross2 />
                </button>
            )}
            <aside className={`sidebar ${asideOpen ? 'open' : ''}`}>
                <div className="sidebar-logo">
                    <div className="sidebar-brand" aria-label="PeopleOps">
                        <span className="sidebar-brand-mark"><LuActivity /></span>
                        <span>PeopleOps</span>
                    </div>
                </div>

                <hr className="sidebar-divider" />

                {/* Profile */}
                <div className="sidebar-profile">
                    <div className="profile-avatar">
                        <IoPersonCircleOutline />
                    </div>
                    <div className="profile-info">
                        <p className="profile-name">Admin</p>
                        <Link to="/" className="logout-btn">
                            <TbLogout2 />
                            <span>Logout</span>
                        </Link>
                    </div>
                </div>

                <hr className="sidebar-divider" />

                {/* Nav */}
                <nav className="sidebar-nav">
                    {/* Dashboard */}
                    <div className="nav-group">
                        <div className="nav-item">
                            <RiDashboardHorizontalLine className="nav-icon" />
                            <Link to="/aside" className="nav-link">
                                Dashboard
                            </Link>
                        </div>
                    </div>

                    {/* Employees */}
                    <div className="nav-group">
                        <div
                            className={`nav-item ${clicked === 'Employees' ? 'active' : ''}`}
                            onClick={() => dropDown('Employees')}
                        >
                            <BsFilePerson className="nav-icon" />
                            <span>Employees</span>
                            <span
                                className={`nav-arrow ${clicked === 'Employees' ? 'rotated' : ''}`}
                            >
                                ›
                            </span>
                        </div>
                        {clicked === 'Employees' && (
                            <ul className="nav-submenu">
                                <li>
                                    <Link
                                        to="addemployee"
                                        className="submenu-link"
                                    >
                                        Add Employee
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="allemployees"
                                        className="submenu-link"
                                    >
                                        All Employees
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </div>

                    {/* Projects */}
                    <div className="nav-group">
                        <div
                            className={`nav-item ${clicked === 'organize' ? 'active' : ''}`}
                            onClick={() => dropDown('organize')}
                        >
                            <BsCollectionFill className="nav-icon" />
                            <span>Projects</span>
                            <span
                                className={`nav-arrow ${clicked === 'organize' ? 'rotated' : ''}`}
                            >
                                ›
                            </span>
                        </div>
                        {clicked === 'organize' && (
                            <ul className="nav-submenu">
                                <li>
                                    <Link
                                        to="addproject"
                                        className="submenu-link"
                                    >
                                        Add Project
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="assignproject"
                                        className="submenu-link"
                                    >
                                        Assign Project
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </div>

                    {/* Attendance */}
                    <div className="nav-group">
                        <div
                            className={`nav-item ${clicked === 'attendance' ? 'active' : ''}`}
                            onClick={() => dropDown('attendance')}
                        >
                            <FaCalendarAlt className="nav-icon" />
                            <span>Attendance</span>
                            <span
                                className={`nav-arrow ${clicked === 'attendance' ? 'rotated' : ''}`}
                            >
                                ›
                            </span>
                        </div>
                        {clicked === 'attendance' && (
                            <ul className="nav-submenu">
                                <li>
                                    <Link
                                        to="attendance"
                                        className="submenu-link"
                                    >
                                        Attendance List
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </div>

                    {/* Resources */}
                    <div className="nav-group">
                        <div
                            className={`nav-item ${clicked === 'resource' ? 'active' : ''}`}
                            onClick={() => dropDown('resource')}
                        >
                            <RiUserSettingsFill className="nav-icon" />
                            <span>Resources</span>
                            <span
                                className={`nav-arrow ${clicked === 'resource' ? 'rotated' : ''}`}
                            >
                                ›
                            </span>
                        </div>
                        {clicked === 'resource' && (
                            <ul className="nav-submenu">
                                <li>
                                    <Link
                                        to="meeting-room"
                                        className="submenu-link"
                                    >
                                        Meeting Room
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="all-meeting-room"
                                        className="submenu-link"
                                    >
                                        Booked Rooms
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </div>

                    {/* Monitor */}
                    <div className="nav-group">
                        <div
                            className={`nav-item ${clicked === 'monitor' ? 'active' : ''}`}
                            onClick={() => dropDown('monitor')}
                        >
                            <LuCctv className="nav-icon" />
                            <span>Monitor</span>
                            <span
                                className={`nav-arrow ${clicked === 'monitor' ? 'rotated' : ''}`}
                            >
                                ›
                            </span>
                        </div>
                        {clicked === 'monitor' && (
                            <ul className="nav-submenu">
                                <li>
                                    <Link
                                        to="Activity-Monitoring"
                                        className="submenu-link"
                                    >
                                        Monitor
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </div>
                </nav>
            </aside>

            {/* ── Main Content ── */}
            <div className="content-area">
                <Outlet />
            </div>
        </div>
    );
};

export default DashBoard;
