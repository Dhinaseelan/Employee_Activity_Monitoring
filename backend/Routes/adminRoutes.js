const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Employee = require('../Models/addEmployeeSchema');
const Project = require('../Models/projectAssignSchema');
const Admin = require('../Models/userSchema');
const { store, isDbUp, genId } = require('../fallbackStore');

// ── REGISTER (create admin) ──
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

        if (!isDbUp()) {
            return res.status(503).json({ message: 'DB not available, use fallback admin' });
        }

        const existing = await Admin.findOne({ email });
        if (existing) return res.status(409).json({ message: 'User already exists' });

        const user = new Admin({ email, password });
        await user.save();
        res.status(201).json({ message: 'Admin created', user: { email: user.email, _id: user._id } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Registration error' });
    }
});

// ── LOGIN ──
router.post('/login', async (req, res) => {
    console.log(req.body);
    try {
        const { email, password } = req.body;

        const FALLBACK_ADMIN = {
            email: 'admin@company.com',
            password: 'admin123',
        };

        if (!isDbUp()) {
            // Check fallback admin
            if (email === FALLBACK_ADMIN.email && password === FALLBACK_ADMIN.password) {
                console.log('Using fallback admin (DB not connected)');
                return res.json({
                    userType: 'admin',
                    user: { email: FALLBACK_ADMIN.email, _id: 'fallback-admin' },
                });
            }
            // Check fallback employees
            const emp = store.employees.find(e => e.email === email);
            if (emp && emp.password === password) {
                return res.json({ userType: emp.role?.toLowerCase() || 'employee', user: emp });
            }
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = await Admin.findOne({ email });
        console.log(user);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.password !== password) return res.status(401).json({ message: 'Invalid password' });
        res.json({ userType: 'admin', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Login error' });
    }
});

// ── ALL USERS ──
router.get('/alluser', async (req, res) => {
    try {
        if (!isDbUp()) {
            return res.json({ allEmployees: store.employees });
        }
        const allEmployees = await Employee.find();
        res.json({ allEmployees });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching employees' });
    }
});

// ── DELETE EMPLOYEE ──
router.delete('/employee/:id', async (req, res) => {
    try {
        if (!isDbUp()) {
            store.employees = store.employees.filter(e => e._id !== req.params.id);
            return res.json({ message: 'Deleted' });
        }
        await Employee.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Delete error' });
    }
});

// ── UPDATE EMPLOYEE ──
router.post('/update', async (req, res) => {
    try {
        if (!isDbUp()) {
            const idx = store.employees.findIndex(e => e._id === req.body._id);
            if (idx === -1) return res.status(404).json({ message: 'Employee not found' });
            store.employees[idx] = { ...store.employees[idx], ...req.body };
            return res.json({ message: 'Employee updated', employee: store.employees[idx] });
        }
        const id = req.body._id;
        const updated = await Employee.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ message: 'Employee updated', employee: updated });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Update failed' });
    }
});

// ── ADD PROJECT ──
router.post('/project', async (req, res) => {
    try {
        const { project_title, project_employee, project_start_date, project_end_date } = req.body;
        if (!project_title || !project_employee || !project_start_date || !project_end_date) {
            return res.status(400).json({ message: 'All fields required' });
        }

        if (!isDbUp()) {
            const newProject = {
                _id: genId(),
                project_title,
                project_employee,
                project_start_date,
                project_end_date,
            };
            store.projects.push(newProject);
            return res.json({ message: 'Project added', project: newProject });
        }

        const newProject = new Project({
            projectName: project_title,
            managerName: project_employee,
            startingDate: project_start_date,
            finishingDate: project_end_date,
        });
        await newProject.save();
        res.json({ message: 'Project added', project: newProject });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Project error' });
    }
});

// ── ALL PROJECTS ──
router.get('/allprojects', async (req, res) => {
    try {
        if (!isDbUp()) {
            return res.json({ allProjects: store.projects });
        }
        const projects = await Project.find();
        const allProjects = projects.map((p) => ({
            _id: p._id,
            project_title: p.projectName,
            project_employee: p.managerName,
            project_start_date: p.startingDate,
            project_end_date: p.finishingDate,
        }));
        res.json({ allProjects });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching projects' });
    }
});

// ── DELETE PROJECT ──
router.delete('/project/:id', async (req, res) => {
    try {
        if (!isDbUp()) {
            store.projects = store.projects.filter(p => p._id !== req.params.id);
            return res.json({ message: 'Project deleted' });
        }
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Delete error' });
    }
});

module.exports = router;
