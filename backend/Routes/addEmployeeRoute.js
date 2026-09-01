const express = require('express');
const router = express.Router();
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');

const Employee = require('../Models/addEmployeeSchema');
const { store, isDbUp, genId } = require('../fallbackStore');

// multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.array('images', 3), async (req, res) => {
    try {
        console.log('BODY:', req.body);
        console.log('FILES:', req.files?.length, 'files');

        // validation
        if (!req.files || req.files.length !== 3) {
            return res.status(400).json({ error: 'Exactly 3 images required' });
        }

        // clean phone
        const cleanPhone = req.body.phone
            ? req.body.phone.replace(/\D/g, '')
            : '';

        // images array
        const images = req.files.map((file) => ({
            data: file.buffer,
            contentType: file.mimetype,
        }));

        let address = {};
        if (typeof req.body.address === 'string') {
            try { address = JSON.parse(req.body.address); } catch { address = {}; }
        } else {
            address = req.body.address;
        }

        if (!isDbUp()) {
            // Save to in-memory store
            const newEmp = {
                _id: genId(),
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                phone: cleanPhone,
                dob: req.body.dob,
                username: req.body.username,
                gender: req.body.gender,
                status: req.body.status,
                role: req.body.role,
                address,
                images: images.map(img => ({
                    data: img.data.toString('base64').slice(0, 50) + '...',
                    contentType: img.contentType,
                })),
                isPresent: false,
                createdAt: new Date(),
            };
            store.employees.push(newEmp);
            console.log('Employee saved to fallback store:', newEmp._id);
            return res.json({ message: 'Employee Saved (in-memory)', imageCount: images.length });
        }

        // MongoDB path
        const newEmployee = new Employee({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            phone: cleanPhone,
            dob: req.body.dob,
            username: req.body.username,
            gender: req.body.gender,
            status: req.body.status,
            role: req.body.role,
            address,
            images,
        });

        await newEmployee.save();
        console.log('Employee saved to MongoDB');

        const extractPath = path.join(__dirname, '../../face_recognition/extractImages.js');
        const encodePath = path.join(__dirname, '../../face_recognition/generate_encodings.py');

        exec(`node "${extractPath}"`, (err, stdout, stderr) => {
            if (err) console.error('Extract Error:', err);
            else console.log('Images extracted:', stdout);
        });

        exec(`python "${encodePath}"`, (err, stdout, stderr) => {
            if (err) console.error('Encoding Error:', err);
            else console.log('Encodings updated:', stdout);
        });

        res.json({ message: 'Employee Saved & Model Updated', imageCount: images.length });
    } catch (err) {
        console.error('FULL ERROR:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
