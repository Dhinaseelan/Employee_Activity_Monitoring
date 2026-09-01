import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import '../css/ActivityMonitoring.css';

// MediaPipe loaded from CDN via index.html — available as window globals
const getFaceMesh = () => window.FaceMesh;
const getCamera = () => window.Camera;

const SEVERITY = {
    error: {
        dot: '#ef4444',
        badge: '#fef2f2',
        bcolor: '#fca5a5',
        label: 'Alert',
        text: '#dc2626',
    },
    warning: {
        dot: '#f59e0b',
        badge: '#fffbeb',
        bcolor: '#fcd34d',
        label: 'Warn',
        text: '#b45309',
    },
    info: {
        dot: '#22c55e',
        badge: '#f0fdf4',
        bcolor: '#86efac',
        label: 'OK',
        text: '#16a34a',
    },
};

const timeStr = () =>
    new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });

const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

const ConfBar = ({ label, pct, color }) => (
    <div className="am-conf-item">
        <label>
            {label}
            <span style={{ color, fontWeight: 700 }}>{pct}%</span>
        </label>
        <div className="am-bar-track">
            <div
                className="am-bar-fill"
                style={{ width: `${pct}%`, background: color }}
            />
        </div>
    </div>
);

const ActivityMonitoring = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const cameraRef = useRef(null);
    const modelRef = useRef(null);
    const lastActiveRef = useRef(Date.now());
    const sessionStartRef = useRef(null);
    const workingTicksRef = useRef(0);
    const totalTicksRef = useRef(0);

    const lastLogRef = useRef({ desc: '', time: 0 });

    const EYE_CLOSED_THRESHOLD = 20;
    const eyesClosedFrames = useRef(0);

    const [status, setStatus] = useState('Camera Off');
    const [warning, setWarning] = useState('');
    const [idleTime, setIdleTime] = useState(0);
    const [sessionTime, setSessionTime] = useState(0);
    const [camActive, setCamActive] = useState(false);
    const [faceCount, setFaceCount] = useState(0);
    const [eyeState, setEyeState] = useState('—');
    const [focusPct, setFocusPct] = useState(0);
    const [flagCount, setFlagCount] = useState(0);
    const [events, setEvents] = useState([]);
    const [confFace, setConfFace] = useState(0);
    const [confGaze, setConfGaze] = useState(0);
    const [confObj, setConfObj] = useState(0);

    useEffect(() => {
        cocoSsd.load().then((m) => {
            modelRef.current = m;
            console.log('COCO-SSD model loaded');
        }).catch(err => console.error('Failed to load COCO-SSD:', err));
    }, []);

    useEffect(() => {
        const iv = setInterval(() => {
            setIdleTime(
                Math.floor((Date.now() - lastActiveRef.current) / 1000),
            );
            if (sessionStartRef.current)
                setSessionTime(
                    Math.floor((Date.now() - sessionStartRef.current) / 1000),
                );
        }, 1000);
        return () => clearInterval(iv);
    }, []);

    const addEvent = useCallback(
        (desc, severity = 'info', cooldownMs = 8000) => {
            const now = Date.now();
            const last = lastLogRef.current;
            if (last.desc === desc && now - last.time < cooldownMs) return;

            lastLogRef.current = { desc, time: now };
            setEvents((prev) =>
                [{ desc, severity, time: timeStr() }, ...prev].slice(0, 15),
            );
            if (severity === 'error') setFlagCount((n) => n + 1);
        },
        [],
    );

    const startCamera = useCallback(() => {
        if (camActive) return;

        const FaceMesh = getFaceMesh();
        const Camera = getCamera();
        if (!FaceMesh || !Camera) {
            setWarning('MediaPipe libraries not loaded. Please refresh the page.');
            return;
        }

        workingTicksRef.current = 0;
        totalTicksRef.current = 0;
        sessionStartRef.current = Date.now();
        lastLogRef.current = { desc: '', time: 0 };
        lastActiveRef.current = Date.now();
        setFlagCount(0);
        setEvents([]);
        addEvent('Session started', 'info', 0);

        const faceMesh = new FaceMesh({
            locateFile: (file) =>
                `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });
        faceMesh.setOptions({
            maxNumFaces: 2,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
        });

        faceMesh.onResults(async (results) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            totalTicksRef.current += 1;

            let phoneDetected = false;
            if (modelRef.current) {
                try {
                    const predictions = await modelRef.current.detect(
                        videoRef.current,
                    );
                    const phone = predictions.find(
                        (p) => p.class === 'cell phone',
                    );
                    if (predictions.length > 0)
                        setConfObj(
                            Math.round(
                                Math.max(...predictions.map((p) => p.score)) *
                                    100,
                            ),
                        );

                    if (phone) {
                        phoneDetected = true;
                        setWarning('Phone detected — please put it away');
                        setStatus('Using Phone');
                        ctx.strokeStyle = '#ef4444';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(...phone.bbox);
                        addEvent('Phone spotted in frame', 'error');
                    }
                } catch (e) {
                    // detection can fail on some frames, ignore
                }
            }

            const numFaces = results.multiFaceLandmarks
                ? results.multiFaceLandmarks.length
                : 0;
            setFaceCount(numFaces);
            setConfFace(numFaces > 0 ? Math.min(94, 70 + numFaces * 12) : 0);

            if (numFaces > 1) {
                setWarning('Multiple people in frame');
                setStatus('Multiple Faces');
                addEvent('More than one face detected', 'error');
            } else if (numFaces === 0) {
                setStatus('No Face Detected');
                setWarning("Can't see your face — please move closer");
                setEyeState('—');
                setConfGaze(0);
                addEvent('Face went out of frame', 'warning');
            } else if (!phoneDetected) {
                const face = results.multiFaceLandmarks[0];
                const eyeOpen =
                    Math.abs(face[159].y - face[145].y) > 0.015;
                const lookingAway = face[1].x < 0.3 || face[1].x > 0.7;
                setConfGaze(
                    Math.round(
                        Math.min(
                            95,
                            50 + Math.abs(face[1].x - 0.5) * 80,
                        ),
                    ),
                );

                if (!eyeOpen) {
                    eyesClosedFrames.current += 1;
                    if (eyesClosedFrames.current >= EYE_CLOSED_THRESHOLD) {
                        setStatus('Eyes Closed');
                        setEyeState('Closed');
                        setWarning('Your eyes have been closed for a while');
                        addEvent('Eyes closed for too long', 'warning');
                    }
                } else if (lookingAway) {
                    eyesClosedFrames.current = 0;
                    setStatus('Looking Away');
                    setEyeState('Open');
                    setWarning('Please look at the screen');
                    addEvent('Looking away from screen', 'warning');
                } else {
                    eyesClosedFrames.current = 0;
                    setStatus('Focused');
                    setEyeState('Open');
                    setWarning('');
                    lastActiveRef.current = Date.now();
                    workingTicksRef.current += 1;
                    addEvent('Back on track', 'info', 12000);
                }
            }

            if (totalTicksRef.current > 0)
                setFocusPct(
                    Math.round(
                        (workingTicksRef.current / totalTicksRef.current) *
                            100,
                    ),
                );
        });

        const camera = new Camera(videoRef.current, {
            onFrame: async () => {
                await faceMesh.send({ image: videoRef.current });
            },
            width: 640,
            height: 480,
        });
        camera.start();
        cameraRef.current = camera;
        setCamActive(true);
    }, [camActive, addEvent]);

    const stopCamera = () => {
        if (cameraRef.current) cameraRef.current.stop();
        setCamActive(false);
        setStatus('Camera Off');
        setWarning('');
        setFaceCount(0);
        setEyeState('—');
        setConfFace(0);
        setConfGaze(0);
        setConfObj(0);
        sessionStartRef.current = null;
        addEvent('Session ended', 'info', 0);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (cameraRef.current) cameraRef.current.stop();
        };
    }, []);

    const statusColor =
        status === 'Focused'
            ? 'c-green'
            : status === 'Camera Off'
              ? 'c-muted'
              : 'c-red';
    const eyeColor =
        eyeState === 'Open'
            ? 'c-green'
            : eyeState === 'Closed'
              ? 'c-red'
              : 'c-muted';
    const focusColor = focusPct >= 70 ? '#16a34a' : focusPct >= 40 ? '#d97706' : '#dc2626';

    return (
        <div className="am-root">
            {/* ── HEADER ── */}
            <header className="am-header">
                <div className="am-header-left">
                    <div className="am-header-title">
                        <span className="am-pulse" />
                        Activity Monitoring
                    </div>
                    <div className="am-header-sub">
                        {camActive
                            ? 'Session in progress'
                            : 'Start a session to begin monitoring'}
                    </div>
                </div>

                <div className="am-header-stats">
                    <div className="am-hstat">
                        <span className="am-hstat-label">Session</span>
                        <span className="am-hstat-val">{fmt(sessionTime)}</span>
                    </div>
                    <div className="am-hstat">
                        <span className="am-hstat-label">Focus</span>
                        <span
                            className="am-hstat-val"
                            style={{ color: focusColor }}
                        >
                            {focusPct}%
                        </span>
                    </div>
                    <div className="am-hstat">
                        <span className="am-hstat-label">Flags</span>
                        <span
                            className="am-hstat-val"
                            style={{
                                color: flagCount > 0 ? '#dc2626' : '#1e293b',
                            }}
                        >
                            {flagCount}
                        </span>
                    </div>
                </div>
            </header>

            <div className="am-body">
                <aside className="am-left">
                    <div className="am-section-label">Camera Feed</div>

                    <div className="am-camera-frame">
                        <div className="am-corner tl" />
                        <div className="am-corner tr" />
                        <div className="am-corner bl" />
                        <div className="am-corner br" />
                        {camActive && <div className="am-scan-line" />}

                        <div
                            className="am-video-wrap"
                            style={{ display: camActive ? 'block' : 'none' }}
                        >
                            <video ref={videoRef} autoPlay muted />
                            <canvas ref={canvasRef} />
                            <div className="am-cam-overlay">
                                <span className="am-cam-badge">LIVE</span>
                                <div className="am-cam-rec">
                                    <span className="am-rec-dot" /> REC
                                </div>
                            </div>
                        </div>

                        {!camActive && (
                            <div className="am-cam-placeholder">
                                <svg
                                    width="38"
                                    height="38"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#b0bcd0"
                                    strokeWidth="1.2"
                                >
                                    <path d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.889L15 14" />
                                    <rect
                                        x="3"
                                        y="6"
                                        width="12"
                                        height="12"
                                        rx="2"
                                    />
                                </svg>
                                <span>Camera Offline</span>
                            </div>
                        )}
                    </div>

                    {warning && (
                        <div className="am-warning-banner">
                            <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#dc2626"
                                strokeWidth="2"
                                style={{ flexShrink: 0 }}
                            >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {warning}
                        </div>
                    )}

                    <div className="am-controls">
                        <button
                            className="am-btn am-btn-start"
                            onClick={startCamera}
                            disabled={camActive}
                        >
                            Start Camera
                        </button>
                        <button
                            className="am-btn am-btn-stop"
                            onClick={stopCamera}
                            disabled={!camActive}
                        >
                            Stop
                        </button>
                    </div>

                    <div className="am-section-label">Model Confidence</div>
                    <div className="am-conf-row">
                        <ConfBar
                            label="Face detection"
                            pct={confFace}
                            color={confFace > 75 ? '#16a34a' : '#d97706'}
                        />
                        <ConfBar
                            label="Gaze tracking"
                            pct={confGaze}
                            color={confGaze > 75 ? '#16a34a' : '#d97706'}
                        />
                        <ConfBar
                            label="Object detect"
                            pct={confObj}
                            color={confObj > 75 ? '#16a34a' : '#d97706'}
                        />
                    </div>
                </aside>

                {/* ── RIGHT PANEL ── */}
                <main className="am-right">
                    {/* Stat Cards */}
                    <div className="am-stat-grid">
                        <div className="am-stat-card">
                            <label>Status</label>
                            <div className={`am-stat-val ${statusColor}`}>
                                {status}
                            </div>
                            <div className="am-stat-sub">Current state</div>
                        </div>
                        <div className="am-stat-card">
                            <label>Idle Time</label>
                            <div className="am-stat-val c-muted">
                                {idleTime}
                                <span
                                    style={{
                                        fontSize: 14,
                                        color: '#cbd5e1',
                                        fontWeight: 400,
                                    }}
                                >
                                    s
                                </span>
                            </div>
                            <div className="am-stat-sub">Since last active</div>
                        </div>
                        <div className="am-stat-card">
                            <label>People in Frame</label>
                            <div
                                className={`am-stat-val ${faceCount > 1 ? 'c-red' : faceCount === 1 ? 'c-green' : 'c-muted'}`}
                            >
                                {faceCount}
                            </div>
                            <div className="am-stat-sub">
                                {faceCount === 1
                                    ? 'Just you'
                                    : faceCount > 1
                                      ? 'Too many'
                                      : 'No one detected'}
                            </div>
                        </div>
                        <div className="am-stat-card">
                            <label>Eyes</label>
                            <div className={`am-stat-val ${eyeColor}`}>
                                {eyeState}
                            </div>
                            <div className="am-stat-sub">Detected state</div>
                        </div>
                    </div>

                    {/* Event Log */}
                    <div className="am-log">
                        <div className="am-log-header">
                            <div className="am-log-title">Recent Activity</div>
                            {events.length > 0 && (
                                <span className="am-log-count">
                                    {events.length} event
                                    {events.length !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>

                        {events.length === 0 ? (
                            <div className="am-empty-log">
                                <svg
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#cbd5e1"
                                    strokeWidth="1.5"
                                >
                                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                                    <rect
                                        x="9"
                                        y="3"
                                        width="6"
                                        height="4"
                                        rx="1"
                                    />
                                </svg>
                                <p>
                                    No activity yet — start a session to begin
                                    monitoring.
                                </p>
                            </div>
                        ) : (
                            events.map((ev, i) => {
                                const s =
                                    SEVERITY[ev.severity] || SEVERITY.info;
                                return (
                                    <div className="am-event" key={i}>
                                        <div
                                            className="am-event-dot"
                                            style={{ background: s.dot }}
                                        />
                                        <div className="am-event-body">
                                            <div className="am-event-desc">
                                                {ev.desc}
                                            </div>
                                            <div className="am-event-time">
                                                {ev.time}
                                            </div>
                                        </div>
                                        <span
                                            className="am-event-badge"
                                            style={{
                                                background: s.badge,
                                                color: s.text,
                                                border: `1px solid ${s.bcolor}`,
                                            }}
                                        >
                                            {s.label}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ActivityMonitoring;
