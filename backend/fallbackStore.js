// In-memory fallback store — used when MongoDB is unreachable
const mongoose = require('mongoose');

const store = {
    employees: [],
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
