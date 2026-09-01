const express = require('express');
const router = express.Router();
const axios = require('axios');
const Attendance = require('../Models/attendanceSchema');
const { store, isDbUp } = require('../fallbackStore');

// In-memory attendance for fallback mode
if (!store.attendance) store.attendance = [];

router.post('/', async (req, res) => {
    try {
        const { image } = req.body;

        let results = [];

        // Try calling the Python face recognition service
        try {
            const pyRes = await axios.post(
                'http://127.0.0.1:5001/api/face-recognize',
                { image },
                { timeout: 5000 },
            );
            results = pyRes.data.results || [];
        } catch (pyErr) {
            console.warn('Python face recognition service unavailable:', pyErr.message);
            // Return empty results if Python service is offline
            return res.json({ results: [], message: 'Face recognition service offline' });
        }

        // Store attendance records
        if (!isDbUp()) {
            // Fallback: store in memory
            for (const face of results) {
                if (face.name !== 'Unknown') {
                    const recent = store.attendance.find(
                        a => a.name === face.name &&
                             (Date.now() - new Date(a.time).getTime()) < 60000
                    );
                    if (!recent) {
                        store.attendance.push({
                            name: face.name,
                            time: new Date(),
                        });
                    }
                }
            }
        } else {
            // MongoDB path
            for (const face of results) {
                if (face.name !== 'Unknown') {
                    const exists = await Attendance.findOne({
                        name: face.name,
                        time: { $gte: new Date(Date.now() - 60000) },
                    });
                    if (!exists) {
                        await Attendance.create({
                            name: face.name,
                            time: new Date(),
                        });
                    }
                }
            }
        }

        res.json({ results });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

router.get('/latest', async (req, res) => {
    try {
        if (!isDbUp()) {
            return res.json(store.attendance.sort((a, b) => new Date(b.time) - new Date(a.time)));
        }
        const records = await Attendance.find().sort({ time: -1 });
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
