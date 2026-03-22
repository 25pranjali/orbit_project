import React, { useState, useCallback, useEffect } from 'react';
import './App.css';
import SettingsPanel from './components/SettingsPanel';
import OrbitCanvas from './components/OrbitCanvas';
import Sidebar from './components/Sidebar';
import SidePanel from './components/SidePanel';
import Tracker from './components/Tracker';
import Journal from './components/Journal';
import SearchPanel from './components/SearchPanel';
import './components/SettingsPanel.css';

/**
 * Main App Component
 * Manages the state of the entire orbit task management system
 */
function App() {
    // Systems data (multiple suns supported)
    const [systems, setSystems] = useState([
        {
            id: 'system-1',
            name: 'Main System',
            bodies: [
                {
                    id: 'sun-1',
                    text: 'React Learning Path',
                    type: 'sun',
                    parent: null,
                    orbitRadius: 0,
                    angle: 0,
                    speed: 0,
                    position: { x: 0, y: 0 },
                    color: '#FFD700',
                    isCompleted: false,
                    overview: 'Complete learning React ecosystem'
                },
                {
                    id: 'planet-1',
                    text: 'Fundamentals',
                    type: 'planet',
                    parent: 'sun-1',
                    orbitRadius: 120,
                    angle: 0,
                    speed: 0.8,
                    position: { x: 120, y: 0 },
                    color: '#00D4FF',
                    isCompleted: false,
                    overview: 'Learn React basics'
                },
                {
                    id: 'moon-1',
                    text: 'Components',
                    type: 'moon',
                    parent: 'planet-1',
                    orbitRadius: 60,
                    angle: 0,
                    speed: 1.5,
                    position: { x: 180, y: 0 },
                    color: '#7FFF00',
                    isCompleted: false,
                    overview: 'Understand functional and class components'
                },
                {
                    id: 'moon-2',
                    text: 'Hooks',
                    type: 'moon',
                    parent: 'planet-1',
                    orbitRadius: 60,
                    angle: 2.1,
                    speed: 1.5,
                    position: { x: 180, y: 0 },
                    color: '#00FF7F',
                    isCompleted: true,
                    overview: 'Master useState, useEffect, useReducer'
                },
                {
                    id: 'planet-2',
                    text: 'Advanced',
                    type: 'planet',
                    parent: 'sun-1',
                    orbitRadius: 200,
                    angle: Math.PI,
                    speed: 0.5,
                    position: { x: -200, y: 0 },
                    color: '#FF1493',
                    isCompleted: false,
                    overview: 'Advanced React patterns'
                },
                {
                    id: 'moon-3',
                    text: 'Context API',
                    type: 'moon',
                    parent: 'planet-2',
                    orbitRadius: 70,
                    angle: 0,
                    speed: 1.5,
                    position: { x: -270, y: 0 },
                    color: '#FF69B4',
                    isCompleted: false,
                    overview: 'Global state management'
                }
            ]
        }
    ]);

    const [activeSystemId, setActiveSystemId] = useState('system-1');
    const [selectedBodyId, setSelectedBodyId] = useState(null);
    const [focusedBodyId, setFocusedBodyId] = useState(null);
    const [cameraPos, setCameraPos] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [currentPage, setCurrentPage] = useState('orbit'); // 'orbit', 'tracker', 'journal'
    const [sidePanel, setSidePanel] = useState({ visible: false, bodyId: null });
    const [searchPanel, setSearchPanel] = useState({ visible: false });
    const [settingsPanel, setSettingsPanel] = useState({ visible: false });
    const [editingBodyId, setEditingBodyId] = useState(null);
    const [editValue, setEditValue] = useState('');

    // Navigation history - store snapshots of systems
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    // Initial history state
    useEffect(() => {
        if (history.length === 0) {
            setHistory([JSON.parse(JSON.stringify(systems))]);
            setHistoryIndex(0);
        }
    }, []);

    // Settings
    const [settings, setSettings] = useState({
        theme: 'dark',
        animationSpeed: 1,
        showOrbitPaths: true,
        autoSave: true,
        keyboardShortcuts: true
    });

    const activeSystem = systems.find(s => s.id === activeSystemId);

    // Auto-save to localStorage
    useEffect(() => {
        if (settings.autoSave) {
            localStorage.setItem('orbitSystems', JSON.stringify(systems));
            localStorage.setItem('orbitSettings', JSON.stringify(settings));
        }
    }, [systems, settings]);

    // Load from localStorage on mount
    useEffect(() => {
        const savedSystems = localStorage.getItem('orbitSystems');
        const savedSettings = localStorage.getItem('orbitSettings');

        if (savedSystems) {
            try {
                setSystems(JSON.parse(savedSystems));
            } catch (error) {
                console.error('Failed to load systems:', error);
            }
        }

        if (savedSettings) {
            try {
                setSettings(JSON.parse(savedSettings));
            } catch (error) {
                console.error('Failed to load settings:', error);
            }
        }
    }, []);

    // Add to history
    const addToHistory = useCallback((newSystemsState) => {
        const nextHistory = history.slice(0, historyIndex + 1);
        nextHistory.push(JSON.parse(JSON.stringify(newSystemsState)));
        
        // Limit history size to 50 steps
        if (nextHistory.length > 50) {
            nextHistory.shift();
        }
        
        setHistory(nextHistory);
        setHistoryIndex(nextHistory.length - 1);
    }, [history, historyIndex]);

    // Undo/Redo
    const undo = useCallback(() => {
        if (historyIndex > 0) {
            const prevState = history[historyIndex - 1];
            setSystems(prevState);
            setHistoryIndex(historyIndex - 1);
        }
    }, [history, historyIndex]);

    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const nextState = history[historyIndex + 1];
            setSystems(nextState);
            setHistoryIndex(historyIndex + 1);
        }
    }, [history, historyIndex]);

    // Handle adding new bodies
    const addBody = useCallback((parentId, bodyType) => {
        const newId = `${bodyType}-${Date.now()}`;

        setSystems(prev => {
            const nextSystems = prev.map(system => {
                if (system.id !== activeSystemId) return system;

                let orbitRadius = 120;
                let speed = 0.8;
                let color = '#00D4FF';

                if (bodyType === 'moon') {
                    orbitRadius = 60;
                    speed = 1.5;
                    color = '#7FFF00';
                } else if (bodyType === 'planet') {
                    color = '#FF1493';
                    speed = 0.5;
                }

                const newBody = {
                    id: newId,
                    text: `New ${bodyType.charAt(0).toUpperCase() + bodyType.slice(1)}`,
                    type: bodyType,
                    parent: parentId,
                    orbitRadius,
                    angle: Math.random() * Math.PI * 2,
                    speed,
                    position: { x: 0, y: 0 },
                    color,
                    isCompleted: false,
                    overview: ''
                };

                return {
                    ...system,
                    bodies: [...system.bodies, newBody]
                };
            });

            // Select newly created body so it appears on screen immediately
            setSelectedBodyId(newId);
            if (bodyType === 'moon') {
                setSidePanel({ visible: true, bodyId: newId });
            }

            addToHistory(nextSystems);
            return nextSystems;
        });

        return newId;
    }, [activeSystemId, addToHistory]);

    // Add a new task (moon)
    const addTask = useCallback((taskText) => {
        setSystems(prev => {
            const nextSystems = prev.map(system => {
                if (system.id !== activeSystemId) return system;

                // Find the first planet to add the moon to
                const planet = system.bodies.find(b => b.type === 'planet');
                if (!planet) return system;

                const newId = `moon-${Date.now()}`;
                const newMoon = {
                    id: newId,
                    text: taskText,
                    type: 'moon',
                    parent: planet.id,
                    orbitRadius: 60,
                    angle: Math.random() * Math.PI * 2,
                    speed: 1.5,
                    position: { x: 0, y: 0 },
                    color: '#7FFF00',
                    isCompleted: false,
                    overview: ''
                };

                return {
                    ...system,
                    bodies: [...system.bodies, newMoon]
                };
            });
            addToHistory(nextSystems);
            return nextSystems;
        });
    }, [activeSystemId, addToHistory]);

    // Handle body selection
    const handleBodySelect = useCallback((bodyId) => {
        if (bodyId === selectedBodyId) {
            setSelectedBodyId(null);
            setFocusedBodyId(null);
            setCameraPos({ x: 0, y: 0 });
            setZoom(1);
        } else {
            const body = activeSystem?.bodies.find(b => b.id === bodyId);
            setSelectedBodyId(bodyId);

            if (body?.type === 'moon') {
                setSidePanel({ visible: true, bodyId });
            } else if (body?.type === 'planet' || body?.type === 'sun') {
                setFocusedBodyId(bodyId);
                setCameraPos({ x: -body.position.x, y: -body.position.y });
                setZoom(2);
            }
        }
    }, [selectedBodyId, activeSystem]);

    // Handle body update (for internal state only)
    const updateBody = useCallback((bodyId, updates) => {
        const body = activeSystem?.bodies.find(b => b.id === bodyId);
        if (!body) return;

        const oldData = {
            text: body.text,
            isCompleted: body.isCompleted,
            overview: body.overview,
            color: body.color
        };

        setSystems(prev => {
            const nextSystems = prev.map(system => {
                if (system.id !== activeSystemId) return system;
                return {
                    ...system,
                    bodies: system.bodies.map(body =>
                        body.id === bodyId ? { ...body, ...updates } : body
                    )
                };
            });
            
            // Only add to history if it's a significant enough update (or debounced)
            // For simplicity here, we add every update
            addToHistory(nextSystems);
            return nextSystems;
        });
    }, [activeSystemId, addToHistory]);

    // Handle body save (explicit user-initiated save, persists to localStorage immediately)
    const saveBody = useCallback((bodyId, updates) => {
        setSystems(prev => {
            const next = prev.map(system => {
                if (system.id !== activeSystemId) return system;

                return {
                    ...system,
                    bodies: system.bodies.map(b =>
                        b.id === bodyId ? { ...b, ...updates } : b
                    )
                };
            });

            addToHistory(next);

            // Always persist when user explicitly clicks Save
            try {
                localStorage.setItem('orbitSystems', JSON.stringify(next));
            } catch (err) {
                console.error('Failed to persist systems to localStorage:', err);
            }

            return next;
        });
    }, [activeSystemId, addToHistory]);

    // Handle body deletion
    const deleteBody = useCallback((bodyId) => {
        const bodyToDelete = activeSystem?.bodies.find(b => b.id === bodyId);
        if (!bodyToDelete) return;

        setSystems(prev => {
            const nextSystems = prev.map(system => {
                if (system.id !== activeSystemId) return system;

                // Remove the body and all its children
                const childrenToRemove = new Set();
                const addChildren = (parentId) => {
                    system.bodies.forEach(body => {
                        if (body.parent === parentId) {
                            childrenToRemove.add(body.id);
                            addChildren(body.id);
                        }
                    });
                };

                addChildren(bodyId);
                childrenToRemove.add(bodyId);

                return {
                    ...system,
                    bodies: system.bodies.filter(b => !childrenToRemove.has(b.id))
                };
            });

            if (selectedBodyId === bodyId) {
                setSelectedBodyId(null);
                setSidePanel({ visible: false, bodyId: null });
            }

            addToHistory(nextSystems);
            return nextSystems;
        });
    }, [activeSystemId, selectedBodyId, addToHistory]);

    // System management functions
    const addSystem = useCallback(() => {
        const name = window.prompt('Enter system name:', 'New System');
        if (!name) return;

        const newId = `system-${Date.now()}`;
        const newSystem = {
            id: newId,
            name: name,
            bodies: [
                {
                    id: `sun-${Date.now()}`,
                    text: 'Empty System',
                    type: 'sun',
                    parent: null,
                    orbitRadius: 0,
                    angle: 0,
                    speed: 0,
                    position: { x: 0, y: 0 },
                    color: '#FFD700',
                    isCompleted: false,
                    overview: 'Add some planets to start!'
                }
            ]
        };

        setSystems(prev => {
            const next = [...prev, newSystem];
            addToHistory(next);
            return next;
        });
        setActiveSystemId(newId);
    }, [addToHistory]);

    const deleteSystem = useCallback((systemId) => {
        if (systems.length <= 1) {
            alert('Cannot delete the last system.');
            return;
        }

        const system = systems.find(s => s.id === systemId);
        if (window.confirm(`Delete system "${system?.name}" and all its contents?`)) {
            setSystems(prev => {
                const next = prev.filter(s => s.id !== systemId);
                if (activeSystemId === systemId) {
                    setActiveSystemId(next[0].id);
                }
                addToHistory(next);
                return next;
            });
        }
    }, [systems, activeSystemId, addToHistory]);

    // Start editing body name
    const startEditing = useCallback((bodyId) => {
        const body = activeSystem?.bodies.find(b => b.id === bodyId);
        if (body) {
            setEditingBodyId(bodyId);
            setEditValue(body.text);
        }
    }, [activeSystem]);

    // Save edited name
    const saveEdit = useCallback(() => {
        if (editingBodyId && editValue.trim()) {
            updateBody(editingBodyId, { text: editValue.trim() });
        }
        setEditingBodyId(null);
        setEditValue('');
    }, [editingBodyId, editValue, updateBody]);

    // Cancel editing
    const cancelEdit = useCallback(() => {
        setEditingBodyId(null);
        setEditValue('');
    }, []);

    // Export systems
    const exportSystems = useCallback(() => {
        const dataStr = JSON.stringify(systems, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = 'orbit-systems.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }, [systems]);

    // Import systems
    const importSystems = useCallback((event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                setSystems(prev => [...prev, ...imported]);
                alert('Systems imported successfully!');
            } catch (error) {
                alert('Invalid file format');
            }
        };

        reader.readAsText(file);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        if (!settings.keyboardShortcuts) return;

        const handleKeyDown = (e) => {
            // Ctrl+Z - Undo
            if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            }
            // Ctrl+Y or Ctrl+Shift+Z - Redo
            else if (e.ctrlKey && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
                e.preventDefault();
                redo();
            }
            // Ctrl+F - Search
            else if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                setSearchPanel({ visible: true });
            }
            // Escape - Close panels
            else if (e.key === 'Escape') {
                setSidePanel({ visible: false, bodyId: null });
                setSearchPanel({ visible: false });
                setSettingsPanel({ visible: false });
                cancelEdit();
            }
            // Enter - Save edit
            else if (e.key === 'Enter' && editingBodyId) {
                saveEdit();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [settings.keyboardShortcuts, undo, redo, saveEdit, cancelEdit, editingBodyId]);

    return (
        <div className={`app-container ${settings.theme}`}>
            <Sidebar
                systems={systems}
                activeSystemId={activeSystemId}
                onSystemChange={setActiveSystemId}
                onAddBody={addBody}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onSearchToggle={() => setSearchPanel({ visible: !searchPanel.visible })}
                onSettingsToggle={() => setSettingsPanel({ visible: !settingsPanel.visible })}
                onExport={exportSystems}
                onImport={importSystems}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
                onUndo={undo}
                onRedo={redo}
                editingBodyId={editingBodyId}
                editValue={editValue}
                onEditChange={setEditValue}
                onSaveEdit={saveEdit}
                onCancelEdit={cancelEdit}
                onStartEdit={startEditing}
                activeSystem={activeSystem}
                onAddSystem={addSystem}
                onDeleteSystem={deleteSystem}
                onResetView={() => {
                    setCameraPos({ x: 0, y: 0 });
                    setZoom(1);
                    setSelectedBodyId(null);
                    setFocusedBodyId(null);
                }}
            />

            <div className="main-content">
                {currentPage === 'orbit' && (
                    <OrbitCanvas
                        bodies={activeSystem?.bodies || []}
                        selectedBodyId={selectedBodyId}
                        focusedBodyId={focusedBodyId}
                        onBodySelect={handleBodySelect}
                        cameraPos={cameraPos}
                        onCameraChange={setCameraPos}
                        zoom={zoom}
                        onZoomChange={setZoom}
                        settings={settings}
                        editingBodyId={editingBodyId}
                        onStartEdit={startEditing}
                    />
                )}

                {currentPage === 'tracker' && (
                    <Tracker
                        bodies={activeSystem?.bodies || []}
                        onBodyUpdate={updateBody}
                    />
                )}

                {currentPage === 'journal' && (
                    <Journal
                        bodies={activeSystem?.bodies || []}
                        onBodyUpdate={updateBody}
                        onAddTask={addTask}
                        onDeleteTask={deleteBody}
                    />
                )}
            </div>

            {currentPage === 'orbit' && (
                <SidePanel
                    visible={sidePanel.visible}
                    body={activeSystem?.bodies.find(b => b.id === sidePanel.bodyId)}
                    onClose={() => setSidePanel({ visible: false, bodyId: null })}
                    // Use explicit save so the user can persist changes immediately
                    onUpdate={saveBody}
                    onDelete={deleteBody}
                    isEditing={editingBodyId === sidePanel.bodyId}
                    editValue={editValue}
                    onStartEdit={startEditing}
                    onEditChange={setEditValue}
                    onSaveEdit={saveEdit}
                    onCancelEdit={cancelEdit}
                />
            )}

            {searchPanel.visible && (
                <SearchPanel
                    bodies={activeSystem?.bodies || []}
                    onBodySelect={(bodyId) => {
                        handleBodySelect(bodyId);
                        setSearchPanel({ visible: false });
                    }}
                    onClose={() => setSearchPanel({ visible: false })}
                />
            )}

            {settingsPanel.visible && (
                <SettingsPanel
                    settings={settings}
                    onSettingsChange={setSettings}
                    onClose={() => setSettingsPanel({ visible: false })}
                />
            )}
        </div>
    );
}

export default App;
