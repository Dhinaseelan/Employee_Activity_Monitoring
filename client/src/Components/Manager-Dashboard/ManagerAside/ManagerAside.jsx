import React, { useContext } from 'react';
// import "../ManagerAside/manageraside.css"
import { Link, Outlet } from 'react-router-dom';
import rmsLogo from '../../Admin-Dashboard/assets/images/logo.png';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { TbLogout2 } from 'react-icons/tb';
import { BsCollectionFill } from 'react-icons/bs';
import { RiUserSettingsFill } from 'react-icons/ri';
import { RiDashboardHorizontalLine } from 'react-icons/ri';
import { RxHamburgerMenu, RxCross2 } from 'react-icons/rx';
import AnotherContext from '../../../Context/AdminContext/AnotherContext';

const ManagerAside = () => {
    const { dropDown, handleClick, clicked, asideOpen } =
        useContext(AnotherContext);

    return (
        <div className="aside-div d-flex ">
            <div className="burger-container d-block d-lg-none ps-5 d-flex align">
                <p className="burger-icon m-0" onClick={handleClick}>
                    <RxHamburgerMenu />
                </p>
            </div>
            {asideOpen && <div className="sidebar-backdrop" onClick={handleClick} />}
            <aside
                className={`aside col-3 col-lg-2 ${
                    asideOpen ? 'open' : ''
                } d-lg-block`}>
                <button className="sidebar-close" onClick={handleClick}><RxCross2 /></button>
                <div className="logo-section">
                    <img className="logo" src={rmsLogo} alt="logo" />
                </div>

                <div className="profile-section ">
                    <div>
                        <IoPersonCircleOutline
                            style={{
                                textDecoration: 'none',
                                color: '#333',
                                fontSize: '70px',
                            }}
                        />
                    </div>
                    <p className="porfile-p fs-5">Manager</p>
                    <Link
                        to={'/'}
                        style={{
                            textDecoration: 'none',
                            color: '#333',
                            fontSize: '25px',
                        }}
                    >
                        <TbLogout2 />
                    </Link>
                </div>
                <hr />

                <section className="dropDowns fs-6 fs-md-6">
                    <div className="drop-div ">
                        <Link
                            style={{ textDecoration: 'none' }}
                            to="/manageraside"
                        >
                            <div className="dropdown-head">
                                <RiDashboardHorizontalLine
                                    style={{
                                        textDecoration: 'none',
                                        color: '#333',
                                        fontSize: '25px',
                                    }}
                                />
                                <h1 className="dash dd-head">DashBoard</h1>
                            </div>
                        </Link>
                    </div>

                    <div
                        onClick={() => dropDown('organize')}
                        className="drop-div"
                    >
                        <div className="dropdown-head">
                            <BsCollectionFill
                                style={{
                                    textDecoration: 'none',
                                    color: '#333',
                                    fontSize: '25px',
                                }}
                            />
                            <h5 className="dd-head">Projects</h5>
                        </div>

                        <div className="drop-li">
                            {clicked === 'organize' && (
                                <ul className="drop">
                                    <Link
                                        to={'manager-projects'}
                                        style={{
                                            textDecoration: 'none',
                                            color: '#555',
                                        }}
                                    >
                                        <li>Your Projects</li>
                                    </Link>
                                </ul>
                            )}
                        </div>
                    </div>

                    <div
                        onClick={() => dropDown('resource')}
                        className="drop-div"
                    >
                        <div className="dropdown-head">
                            <RiUserSettingsFill
                                style={{
                                    textDecoration: 'none',
                                    color: '#333',
                                    fontSize: '25px',
                                }}
                            />
                            <h5 className="dd-head ">Rooms</h5>
                        </div>

                        <div className="drop-li">
                            {clicked === 'resource' && (
                                <ul className="drop">
                                    <Link
                                        style={{
                                            textDecoration: 'none',
                                            color: '#555',
                                        }}
                                        to={'manager-booked-rooms'}
                                    >
                                        <li>Booked Rooms</li>
                                    </Link>
                                </ul>
                            )}
                        </div>
                    </div>
                </section>
            </aside>
            <div className="content-area">{<Outlet />}</div>
        </div>
    );
};

export default ManagerAside;
