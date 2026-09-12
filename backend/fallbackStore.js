// In-memory fallback store — used when MongoDB is unreachable
const mongoose = require('mongoose');

const store = {
    employees: [
        {
            _id: 'seed-manager-1',
            firstName: 'Raj',
            lastName: 'Kumar',
            email: 'raj@company.com',
            password: 'manager123',
            phone: '9876543210',
            dob: '1990-05-15',
            username: 'raj',
            gender: 'Male',
            status: 'Active',
            role: 'Manager',
            address: {},
            images: [],
            isPresent: false,
            createdAt: new Date(),
        },
        {
            _id: 'seed-employee-1',
            firstName: 'Priya',
            lastName: 'Singh',
            email: 'priya@company.com',
            password: 'employee123',
            phone: '9123456789',
            dob: '1995-08-20',
            username: 'priya',
            gender: 'Female',
            status: 'Active',
            role: 'Employee',
            address: {},
            images: [],
            isPresent: false,
            createdAt: new Date(),
        },
    ],
    projects: [],
    assignedProjects: [],
    bookedRooms: [],
    _nextId: 1,
};

function isDbUp() {
    return mongoose.connection.readyState === 1;
}

function genId() {
    return 'local-' + (store._nextId++);
}

module.exports = { store, isDbUp, genId };
