import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import AllMeetingRooms from '../../Components/Admin-Dashboard/pages/BookedRooms';
import { useNavigate } from 'react-router-dom';

const AnotherContext = createContext({});

// Fallback API URL — used when VITE_API_URL env var is not set
const API_BASE = import.meta.env.VITE_API_URL || 'https://employee-monitoring-api.onrender.com';

export const DataProviderTwo = ({ children }) => {
    const navigate = useNavigate();
    const [showEmployee, setShowEmployee] = useState(false);

    const handleEmployee = (e) => {
        e.preventDefault();
        setShowEmployee((prev) => !prev);
    };

    const [attendance, setAttendance] = useState({});

    useEffect(() => {
        const storedAttendance = JSON.parse(localStorage.getItem('attendance'));
        if (storedAttendance) {
            setAttendance(storedAttendance);
        }
    }, []);

    const handlePresent = async (id) => {
        const updatedStatus = !attendance[id]?.isPresent;

        setAttendance((prev) => {
            const updatedAttendance = {
                ...prev,
                [id]: {
                    isPresent: updatedStatus,
                    markedAt: new Date().toLocaleString(),
                },
            };

            localStorage.setItem(
                'attendance',
                JSON.stringify(updatedAttendance),
            );

            return updatedAttendance;
        });

        try {
            const response = await axios.put(
                `${API_BASE}/project/attendance/${id}`,
                { isPresent: updatedStatus },
            );
            console.log('Attendance updated successfully:', response.data);
        } catch (error) {
            console.error('Error updating attendance:', error.message);
        }
    };

    // dashboard functions

    const [clicked, setClicked] = useState(null);
    const [asideOpen, setAsideOpen] = useState(false);

    const dropDown = (dropDownName) => {
        setClicked(dropDownName === clicked ? null : dropDownName);
    };

    const handleClick = () => {
        setAsideOpen(!asideOpen);
    };

    const handleRoomDelete = (empId) => {
        axios
            .delete(
                `${API_BASE}/project/booked-room/${empId}`,
            )
            .then((res) => {
                AllMeetingRooms();
            })
            .catch((error) => {
                console.log('Error Deleting Booked Room', error);
            });
    };

    //  assign component function

    const [selectedProject, setSelectedProject] = useState(null);

    const handleAssign = (each) => {
        setSelectedProject(each);
        navigate('/aside/assignproject');
    };

    const [assignFormData, setAssignFormData] = useState({
        projectName: '',
        managerName: '',
        startingDate: '',
        finishingDate: '',
        selectedEmployees: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAssignFormData({
            ...assignFormData,
            [name]: value,
        });
    };

    useEffect(() => {
        if (selectedProject) {
            setAssignFormData({
                projectName: selectedProject.project_title || '',
                managerName: selectedProject.project_employee || '',
                startingDate: selectedProject.project_start_date || '',
                finishingDate: selectedProject.project_end_date || '',
                selectedEmployees: [],
            });
        }
    }, [selectedProject]);

    const handleSelectedemployee = (e) => {
        const selectedOptions = Array.from(
            e.target.selectedOptions,
            (option) => option.value,
        );
        setAssignFormData({
            ...assignFormData,
            selectedEmployees: selectedOptions,
        });
    };

    const [popUp, setPopUp] = useState({
        show: false,
        message: '',
        isSuccess: false,
    });

    const handleAssignSubmit = async (e) => {
        e.preventDefault();

        try {
            const assignResponse = await axios.post(
                `${API_BASE}/project/assignproject`,
                assignFormData,
            );

            if (assignResponse.status === 200) {
                setPopUp({
                    show: true,
                    message: 'Project assigned successfully!',
                    isSuccess: true,
                });

                await new Promise((resolve) => setTimeout(resolve, 1000));

                const notifyResponse = await axios.post(
                    `${API_BASE}/project/notify-manager-and-employees`,
                    {
                        project: assignFormData,
                        manager: assignFormData.managerName,
                        employees: assignFormData.selectedEmployees,
                    },
                );

                if (notifyResponse.status === 200) {
                    setPopUp({
                        show: true,
                        message:
                            'Notifications sent successfully to Employees!',
                        isSuccess: true,
                    });

                    setTimeout(() => {
                        setPopUp({ show: false, message: '', isSuccess: true });
                    }, 2000);
                } else {
                    alert(
                        'Project assigned, but failed to send notifications.',
                    );
                }
            } else {
                alert('Failed to assign the project.');
            }

            setAssignFormData({
                projectName: '',
                managerName: '',
                startingDate: '',
                finishingDate: '',
                selectedEmployees: [],
            });
        } catch (error) {
            console.error(
                'Error during project assignment or notification:',
                error,
            );
            alert(
                'An error occurred while assigning the project or sending notifications.',
            );
        }
    };

    const [assignedProjects, setAssignedProjects] = useState([]);

    useEffect(() => {
        const fetchAssignedProjects = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE}/project/assignedprojects`,
                );
                setAssignedProjects(response.data);
            } catch (error) {
                console.error('Error fetching assigned projects:', error);
            }
        };

        fetchAssignedProjects();
    }, []);

    const [bookedRooms, setBookedRooms] = useState([]);

    useEffect(() => {
        const fetchBookedRooms = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE}/project/booked-rooms`,
                );
                setBookedRooms(response.data);
            } catch (error) {
                console.error('Error fetching booked rooms:', error);
            }
        };

        fetchBookedRooms();
    }, []);

    return (
        <AnotherContext.Provider
            value={{
                showEmployee,
                handleEmployee,
                setShowEmployee,
                handlePresent,
                attendance,
                setAttendance,
                dropDown,
                handleClick,
                clicked,
                setClicked,
                asideOpen,
                setAsideOpen,
                handleRoomDelete,
                handleAssignSubmit,
                handleSelectedemployee,
                handleChange,
                handleAssign,
                assignFormData,
                setPopUp,
                popUp,
                assignedProjects,
                setAssignedProjects,
                bookedRooms,
            }}
        >
            {children}
        </AnotherContext.Provider>
    );
};

export default AnotherContext;
