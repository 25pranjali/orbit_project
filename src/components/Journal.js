import React, { useState, useMemo, useEffect, useRef } from 'react';

/**
 * Journal Component
 * Task/journal management with completion tracking
 */
function Journal({ bodies, onBodyUpdate, onAddTask, onDeleteTask }) {
    const [newTask, setNewTask] = useState('');
    const [taskTimers, setTaskTimers] = useState({}); // { taskId: { timeLeft, isActive, duration, mode } }
    const [picker, setPicker] = useState({ visible: false, taskId: null, hours: 0, minutes: 0, seconds: 0, mode: 'minutes' });
    const [modal, setModal] = useState({ visible: false, type: '', message: '', taskId: null });
    const clockRef = useRef(null);


    // Get all moons as tasks
    const moons = useMemo(() => {
        return bodies.filter(b => b.type === 'moon');
    }, [bodies]);

    const stats = useMemo(() => {
        const completedCount = moons.filter(b => b.isCompleted).length;
        const percentage = moons.length > 0 ? Math.round((completedCount / moons.length) * 100) : 0;
        return { completedCount, totalCount: moons.length, percentage };
    }, [moons]);

    const handleAddTask = () => {
        if (newTask.trim()) {
            onAddTask(newTask.trim());
            setNewTask('');
        }
    };

    const handleToggleTask = (taskId) => {
        const task = bodies.find(b => b.id === taskId);
        if (task) {
            const newIsCompleted = !task.isCompleted;
            onBodyUpdate(taskId, { isCompleted: newIsCompleted });

            if (newIsCompleted && taskTimers[taskId]?.isActive) {
                setModal({
                    visible: true,
                    type: 'success',
                    message: `🎉 Goal Achieved! You completed "${task.text}" with time remaining!`
                });
                stopTaskTimer(taskId);
            }
        }
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const openTimePicker = (taskId) => {
        setPicker({ ...picker, visible: true, taskId });
    };

    const startTaskTimer = (taskId) => {
        setTaskTimers(prev => ({
            ...prev,
            [taskId]: {
                ...(prev[taskId] || { timeLeft: 0, isActive: false, duration: 0 }),
                isActive: !prev[taskId]?.isActive
            }
        }));
    };

    const stopTaskTimer = (taskId) => {
        setTaskTimers(prev => ({
            ...prev,
            [taskId]: { ...prev[taskId], isActive: false }
        }));
    };

    // Global countdown for all active task timers
    useEffect(() => {
        const interval = setInterval(() => {
            setTaskTimers(prev => {
                const next = { ...prev };
                let changed = false;

                Object.keys(next).forEach(taskId => {
                    const timer = next[taskId];
                    if (timer.isActive && timer.timeLeft > 0) {
                        next[taskId] = { ...timer, timeLeft: timer.timeLeft - 1 };
                        changed = true;

                        if (next[taskId].timeLeft === 0) {
                            next[taskId].isActive = false;
                            setModal({
                                visible: true,
                                type: 'query',
                                taskId: taskId,
                                message: `⏰ Time's up! Did you complete "${next[taskId].text || bodies.find(b => b.id === taskId)?.text || 'the task'}"?`
                            });
                        }
                    }
                });

                return changed ? next : prev;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [bodies]);

    const handleClockInteraction = (e) => {
        if (!picker.visible || !clockRef.current) return;
        const rect = clockRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const rad = Math.atan2(dy, dx);
        let deg = (rad * 180) / Math.PI;
        deg = (deg + 90 + 360) % 360;

        if (picker.mode === 'hours') {
            const hour = Math.round(deg / 30) % 12;
            setPicker(prev => ({ ...prev, hours: hour }));
        } else if (picker.mode === 'minutes') {
            const minute = Math.round(deg / 6) % 60;
            setPicker(prev => ({ ...prev, minutes: minute }));
        } else {
            const second = Math.round(deg / 6) % 60;
            setPicker(prev => ({ ...prev, seconds: second }));
        }
    };

    const saveTimer = () => {
        const durationSeconds = (picker.hours * 3600) + (picker.minutes * 60) + picker.seconds;
        if (durationSeconds === 0) return; // don't set a zero timer
        setTaskTimers(prev => ({
            ...prev,
            [picker.taskId]: {
                timeLeft: durationSeconds,
                duration: durationSeconds,
                isActive: false
            }
        }));
        setPicker(prev => ({ ...prev, visible: false }));
    };

    const cancelPicker = () => {
        setPicker(prev => ({ ...prev, visible: false }));
    };

    const handleDeleteTask = (taskId) => {
        onDeleteTask(taskId);
    };

    return (
        <div className="journal-container">
            <div className="journal-header">
                <div className="journal-title">📝 Journal & Tasks</div>
            </div>

            <div className="add-task-section">
                <div className="input-group">
                    <input
                        type="text"
                        className="task-input"
                        placeholder="Add a new task or topic..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleAddTask();
                            }
                        }}
                    />
                    <button className="btn-add" onClick={handleAddTask}>
                        Add
                    </button>
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <div className="panel-label">Active Tasks</div>
                <div className="tasks-list">
                    {moons.map(moon => (
                        <div key={moon.id} className="task-item">
                            <input
                                type="checkbox"
                                className="task-checkbox"
                                checked={moon.isCompleted || false}
                                onChange={() => handleToggleTask(moon.id)}
                            />
                            <div className="task-text" style={{
                                textDecoration: moon.isCompleted ? 'line-through' : 'none',
                                color: moon.isCompleted ? '#7FFF00' : '#e0e6ff'
                            }}>
                                <strong>{moon.text}</strong>
                                {moon.overview && (
                                    <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px' }}>
                                        {moon.overview}
                                    </div>
                                )}
                            </div>
                            <div className="task-actions">
                                {taskTimers[moon.id]?.timeLeft > 0 ? (
                                    <div className="task-timer-pill">
                                        <span>{formatTime(taskTimers[moon.id].timeLeft)}</span>
                                        <button
                                            className={`mini-timer-btn ${taskTimers[moon.id].isActive ? 'pause' : 'start'}`}
                                            onClick={() => startTaskTimer(moon.id)}
                                        >
                                            {taskTimers[moon.id].isActive ? '⏸' : '▶'}
                                        </button>
                                        <button
                                            className="mini-timer-btn reset"
                                            onClick={() => openTimePicker(moon.id)}
                                        >
                                            🔄
                                        </button>
                                    </div>
                                ) : (
                                    !moon.isCompleted && (
                                        <button
                                            className="task-timer-btn"
                                            onClick={() => openTimePicker(moon.id)}
                                            title="Set Timer"
                                        >
                                            ⏱️
                                        </button>
                                    )
                                )}
                                <button
                                    className="task-delete"
                                    onClick={() => handleDeleteTask(moon.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                    {moons.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#a0a6ff', fontSize: '13px' }}>
                            No topics yet. Add one from the Orbit View! 🚀
                        </div>
                    )}
                </div>
            </div>

            <div className="journal-progress">
                <div className="journal-progress-title">📈 Overall Progress</div>
                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                    <div style={{ fontSize: '12px', color: '#a0a6ff', marginBottom: '8px' }}>
                        {stats.completedCount} / {stats.totalCount} topics completed
                    </div>
                    <div className="progress-bar-container">
                        <div
                            className="progress-bar"
                            style={{ width: `${stats.percentage}%` }}
                        >
                            {stats.percentage > 10 && `${stats.percentage}%`}
                        </div>
                    </div>
                </div>
                <div className="journal-progress-percent">{stats.percentage}% Complete</div>
            </div>
            {/* Time Picker Modal */}
            {picker.visible && (
                <div className="time-picker-overlay" onClick={cancelPicker}>
                    <div className="time-picker-modal" onClick={e => e.stopPropagation()}>
                        <div className="picker-header">SELECT TIME</div>

                        <div className="digital-display">
                            <span
                                className={`display-unit ${picker.mode === 'hours' ? 'active' : ''}`}
                                onClick={() => setPicker(prev => ({ ...prev, mode: 'hours' }))}
                                title="Hours"
                            >
                                {picker.hours.toString().padStart(2, '0')}
                            </span>
                            <span className="display-separator">:</span>
                            <span
                                className={`display-unit ${picker.mode === 'minutes' ? 'active' : ''}`}
                                onClick={() => setPicker(prev => ({ ...prev, mode: 'minutes' }))}
                                title="Minutes"
                            >
                                {picker.minutes.toString().padStart(2, '0')}
                            </span>
                            <span className="display-separator">:</span>
                            <span
                                className={`display-unit ${picker.mode === 'seconds' ? 'active' : ''}`}
                                onClick={() => setPicker(prev => ({ ...prev, mode: 'seconds' }))}
                                title="Seconds"
                            >
                                {picker.seconds.toString().padStart(2, '0')}
                            </span>
                        </div>

                        <div className="ampm-toggle">
                            <button
                                className={picker.mode === 'hours' ? 'active' : ''}
                                onClick={() => setPicker(prev => ({ ...prev, mode: 'hours' }))}
                            >HH</button>
                            <button
                                className={picker.mode === 'minutes' ? 'active' : ''}
                                onClick={() => setPicker(prev => ({ ...prev, mode: 'minutes' }))}
                            >MM</button>
                            <button
                                className={picker.mode === 'seconds' ? 'active' : ''}
                                onClick={() => setPicker(prev => ({ ...prev, mode: 'seconds' }))}
                            >SS</button>
                        </div>

                        <div className="clock-face-container">
                            <div
                                className="clock-face"
                                ref={clockRef}
                                onMouseDown={(e) => {
                                    handleClockInteraction(e);
                                    const moveHandler = (me) => handleClockInteraction(me);
                                    const upHandler = () => {
                                        window.removeEventListener('mousemove', moveHandler);
                                        window.removeEventListener('mouseup', upHandler);
                                    };
                                    window.addEventListener('mousemove', moveHandler);
                                    window.addEventListener('mouseup', upHandler);
                                }}
                            >
                                {[...Array(12)].map((_, i) => {
                                    const val = (i + 1);
                                    let displayVal;
                                    if (picker.mode === 'hours') {
                                        displayVal = i; // 0-11 for hours (duration)
                                    } else {
                                        displayVal = (i + 1 === 12 ? '00' : ((i + 1) * 5).toString().padStart(2, '0'));
                                    }
                                    const angle = (val * 30 - 90) * (Math.PI / 180);
                                    const x = 50 + 40 * Math.cos(angle);
                                    const y = 50 + 40 * Math.sin(angle);
                                    return (
                                        <div
                                            key={val}
                                            className="clock-number"
                                            style={{ left: `${x}%`, top: `${y}%` }}
                                        >
                                            {displayVal}
                                        </div>
                                    );
                                })}
                                <div
                                    className="clock-hand"
                                    style={{
                                        transform: `rotate(${
                                            picker.mode === 'hours'
                                                ? picker.hours * 30
                                                : picker.mode === 'minutes'
                                                    ? picker.minutes * 6
                                                    : picker.seconds * 6
                                        }deg)`
                                    }}
                                />
                                <div className="clock-center" />
                            </div>
                        </div>

                        <div className="picker-footer">
                            <button className="picker-cancel-btn" onClick={cancelPicker}>CANCEL</button>
                            <button className="picker-ok-btn" onClick={saveTimer}>OK</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pop-up Modal */}
            {modal.visible && (
                <div className="modal-overlay" onClick={() => setModal({ ...modal, visible: false })}>
                    <div className={`modal-content ${modal.type}`} onClick={e => e.stopPropagation()}>
                        <h2>{modal.type === 'success' ? 'Great Job!' : (modal.type === 'query' ? 'Task Status' : 'Keep Going!')}</h2>
                        <p>{modal.message}</p>

                        {modal.type === 'query' ? (
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                                <button
                                    className="modal-close-btn"
                                    style={{ marginTop: 0, background: '#7FFF00' }}
                                    onClick={() => {
                                        handleToggleTask(modal.taskId);
                                        setModal({ ...modal, visible: false });
                                    }}
                                >
                                    Yes, Done!
                                </button>
                                <button
                                    className="modal-close-btn"
                                    style={{ marginTop: 0, background: '#FF4B2B' }}
                                    onClick={() => setModal({ ...modal, visible: false })}
                                >
                                    Not Yet
                                </button>
                            </div>
                        ) : (
                            <button
                                className="modal-close-btn"
                                onClick={() => setModal({ ...modal, visible: false })}
                            >
                                Close
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Journal;
