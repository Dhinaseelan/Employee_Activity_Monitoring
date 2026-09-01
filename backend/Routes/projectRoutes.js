const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const AssignProject = require('../Models/projectAssignSchema');
const employees = require('../Models/addEmployeeSchema');
const RoomBooking = require('../Models/roomSchema');
const { store, isDbUp, genId } = require('../fallbackStore');

router.post('/assignproject', async (req, res) => {
    const {
        projectName,
        managerName,
        startingDate,
        finishingDate,
        selectedEmployees,
    } = req.body;

    if (!Array.isArray(selectedEmployees) || selectedEmployees.length === 0) {
        return res.status(400).json({ message: 'Invalid employee names' });
    }

    try {
        if (!isDbUp()) {
            const assigned = {
                _id: genId(),
                projectName,
                managerName,
                startingDate,
                finishingDate,
                selectedEmployees,
            };
            store.assignedProjects.push(assigned);
            return res.status(200).json({ message: 'New Project Assigned Successfully' });
        }

        const newAssignedProject = new AssignProject({
            projectName,
            managerName,
            startingDate,
            finishingDate,
            selectedEmployees,
        });
        await newAssignedProject.save();
        res.status(200).json({ message: 'New Project Assigned Successfully' });
    } catch (error) {
        console.error('Error assigning project:', error.message);
        res.status(500).json({ message: 'Error Assigning Project', error: error.message });
    }
});

router.put('/attendance/:id', async (req, res) => {
    const { id } = req.params;
    const { isPresent } = req.body;

    try {
        if (!isDbUp()) {
            const emp = store.employees.find(e => e._id === id);
            if (!emp) return res.status(404).json({ message: 'Employee not found' });
            emp.isPresent = isPresent;
            return res.status(200).json({ message: 'Attendance added successfully', employee: emp });
        }

        const updatedEmployee = await employees.findByIdAndUpdate(id, { isPresent }, { new: true });
        if (!updatedEmployee) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json({ message: 'Attendance added successfully', employee: updatedEmployee });
    } catch (error) {
        console.error('Error updating attendance:', error.message);
        res.status(500).json({ message: 'Error updating attendance', error: error.message });
    }
});

router.post('/room-booking', async (req, res) => {
    const {
        projectHead,
        roomsForMeeting,
        reasonForMeeting,
        bookingDate,
        meetingStartingTime,
        meetingEndingTime,
        additionalRequirement,
    } = req.body;

    try {
        if (!isDbUp()) {
            const booking = {
                _id: genId(),
                projectHead,
                roomsForMeeting,
                reasonForMeeting,
                bookingDate,
                meetingStartingTime,
                meetingEndingTime,
                additionalRequirement,
            };
            store.bookedRooms.push(booking);
            return res.status(200).json({ message: 'Room Booked Successfully' });
        }

        const newRoomBooking = new RoomBooking({
            projectHead,
            roomsForMeeting,
            reasonForMeeting,
            bookingDate,
            meetingStartingTime,
            meetingEndingTime,
            additionalRequirement,
        });
        await newRoomBooking.save();
        res.status(200).json({ message: 'Room Booked Successfully' });
    } catch (error) {
        console.log('Error Booking Room', error);
        res.status(500).json({ message: 'Error Booking Room', error: error.message });
    }
});

router.get('/all-booked-rooms', async (req, res) => {
    try {
        if (!isDbUp()) {
            return res.json({ message: 'Successfully Fetched Booked Rooms', allBookedRooms: store.bookedRooms });
        }
        const allBookedRooms = await RoomBooking.find();
        res.status(200).json({ message: 'Successfully Fetched Booked Rooms', allBookedRooms });
    } catch (error) {
        console.error('Error Fetching Booked Rooms', error);
        res.status(500).json({ message: 'Error Fetching Booked Rooms', error });
    }
});

router.delete('/booked-room/:id', async (req, res) => {
    const { id } = req.params;
    try {
        if (!isDbUp()) {
            const before = store.bookedRooms.length;
            store.bookedRooms = store.bookedRooms.filter(r => r._id !== id);
            if (store.bookedRooms.length === before) {
                return res.status(404).json({ message: 'Booked Room not found' });
            }
            return res.status(200).json({ message: 'Booked Room deleted successfully' });
        }

        const Room = await RoomBooking.findByIdAndDelete(id);
        if (Room) {
            res.status(200).json({ message: 'Booked Room deleted successfully' });
        } else {
            res.status(404).json({ message: 'Booked Room not found' });
        }
    } catch (error) {
        console.log('Error Deleting Rooms', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

const sendNotification = (employee, project) => {
    console.log(`Sending notification to ${employee}:`);
    console.log(`Assigned to project: ${project.projectName}`);
};

router.post('/notify-manager-and-employees', async (req, res) => {
    const { project, manager, employees } = req.body;
    if (!project || !manager || !employees || employees.length === 0) {
        return res.status(400).json({ message: 'Invalid data provided.' });
    }
    try {
        console.log(`Notifying manager ${manager}: Project "${project.projectName}" has been assigned.`);
        employees.forEach((employee) => {
            console.log(`Notifying employee ${employee}: Assigned to project "${project.projectName}".`);
        });
        res.status(200).json({ message: 'Notifications sent to manager and employees successfully!' });
    } catch (error) {
        console.error('Error sending notifications:', error);
        res.status(500).json({ message: 'Failed to send notifications.' });
    }
});

router.get('/assignedprojects', async (req, res) => {
    try {
        if (!isDbUp()) {
            return res.status(200).json(store.assignedProjects);
        }
        const assignedProjects = await AssignProject.find();
        res.status(200).json(assignedProjects);
    } catch (error) {
        console.error('Error fetching assigned projects:', error);
        res.status(500).json({ message: 'Failed to fetch assigned projects.' });
    }
});

router.get('/booked-rooms', async (req, res) => {
    try {
        if (!isDbUp()) {
            return res.status(200).json(store.bookedRooms);
        }
        const bookedrooms = await RoomBooking.find();
        res.status(200).json(bookedrooms);
    } catch (error) {
        console.error('Error fetching Booked Rooms:', error);
        res.status(500).json({ message: 'Failed to fetch Booked Rooms.' });
    }
});

module.exports = router;
