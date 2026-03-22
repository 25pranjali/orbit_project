import React, { useState } from 'react';
import './Sidebar.css';

/**
 * Sidebar Component
 * Navigation and system management
 */
function Sidebar({
    visible,
    onClose,
    systems,
    activeSystemId,
    onSystemChange,
    onAddBody,
    currentPage,
    onPageChange,
    onSearchToggle,
    onSettingsToggle,
    onExport,
    onImport,
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    editingBodyId,
    editValue,
    onEditChange,
    onSaveEdit,
    onCancelEdit,
    onStartEdit,
    activeSystem,
    onAddSystem,
    onDeleteSystem,
    onResetView
}) {
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [selectedParentId, setSelectedParentId] = useState(null);

    const handleAddBody = (bodyType) => {
        if (selectedParentId) {
            onAddBody(selectedParentId, bodyType);
            setShowAddMenu(false);
            setSelectedParentId(null);
        }
    };

    const renderBodyTree = (bodies, parentId = null, level = 0) => {
        return bodies
            .filter(body => body.parent === parentId)
            .map(body => (
                <div key={body.id} className="body-tree-item">
                    <div
                        className={`body-item ${body.type} ${activeSystem?.bodies.find(b => b.id === body.id)?.isCompleted ? 'completed' : ''}`}
                        style={{ paddingLeft: `${20 + level * 20}px` }}
                        onClick={() => {
                            if (editingBodyId === body.id) return;
                            setSelectedParentId(body.id);
                        }}
                        onDoubleClick={() => onStartEdit(body.id)}
                    >
                        <div className="body-icon" style={{ backgroundColor: body.color }}>
                            {body.type === 'sun' && '☀️'}
                            {body.type === 'planet' && '🪐'}
                            {body.type === 'moon' && '🌙'}
                        </div>

                        {editingBodyId === body.id ? (
                            <input
                                type="text"
                                value={editValue}
                                onChange={(e) => onEditChange(e.target.value)}
                                onBlur={onSaveEdit}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') onSaveEdit();
                                    if (e.key === 'Escape') onCancelEdit();
                                }}
                                autoFocus
                                className="edit-input"
                            />
                        ) : (
                            <span className="body-text">{body.text}</span>
                        )}

                        <div className="body-actions">
                            <button
                                className="action-btn rename-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onStartEdit(body.id);
                                }}
                                title="Rename"
                            >
                                ✎
                            </button>
                            <button
                                className="action-btn add-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedParentId(body.id);
                                    setShowAddMenu(true);
                                }}
                                title="Add child"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {renderBodyTree(bodies, body.id, level + 1)}
                </div>
            ));
    };

    return (
        <div className={`sidebar ${visible ? 'visible' : ''}`}>
            <div className="sidebar-header">
                <div className="header-top">
                    <h2>Orbit Tasks</h2>
                    <button className="mobile-close-btn" onClick={onClose} aria-label="Close Sidebar">
                        ✕
                    </button>
                </div>
                <div className="header-actions">
                    <button
                        className="action-btn"
                        onClick={onSearchToggle}
                        title="Search (Ctrl+F)"
                    >
                        🔍
                    </button>
                    <button
                        className="action-btn"
                        onClick={onSettingsToggle}
                        title="Settings"
                    >
                        ⚙️
                    </button>
                    <button
                        className="action-btn"
                        onClick={onResetView}
                        title="Reset View"
                    >
                        🏠
                    </button>
                </div>
            </div>

            <div className="system-selector">
                <div className="selector-group">
                    <select
                        value={activeSystemId}
                        onChange={(e) => onSystemChange(e.target.value)}
                    >
                        {systems.map(system => (
                            <option key={system.id} value={system.id}>
                                {system.name}
                            </option>
                        ))}
                    </select>
                    <button className="icon-btn add-system-btn" onClick={onAddSystem} title="New System">+</button>
                    <button className="icon-btn delete-system-btn" onClick={() => onDeleteSystem(activeSystemId)} title="Delete System">🗑️</button>
                </div>
            </div>

            <div className="navigation">
                <button
                    className={`nav-button ${currentPage === 'orbit' ? 'active' : ''}`}
                    onClick={() => onPageChange('orbit')}
                >
                    🪐 Orbit View
                </button>
                <button
                    className={`nav-button ${currentPage === 'tracker' ? 'active' : ''}`}
                    onClick={() => onPageChange('tracker')}
                >
                    📊 Progress Tracker
                </button>
                <button
                    className={`nav-button ${currentPage === 'journal' ? 'active' : ''}`}
                    onClick={() => onPageChange('journal')}
                >
                    📝 Task Journal
                </button>
            </div>

            <div className="bodies-section">
                <div className="section-header">
                    <h3>Task Bodies</h3>
                    <div className="section-actions">
                        <button
                            className="action-btn add-orbit-btn"
                            onClick={() => {
                                const rootSun = activeSystem?.bodies.find(b => b.type === 'sun');
                                if (rootSun) {
                                    onAddBody(rootSun.id, 'planet');
                                }
                            }}
                            title="Add new orbit"
                        >
                            ⭐ New Orbit
                        </button>
                        <button
                            className="action-btn add-child-btn"
                            onClick={() => {
                                if (!selectedParentId) {
                                    alert('Please select an orbit first to add a child');
                                    return;
                                }
                                onAddBody(selectedParentId, 'moon');
                            }}
                            disabled={!selectedParentId}
                            title="Add new child to selected orbit"
                        >
                            👶 New Child
                        </button>
                    </div>
                </div>

                {showAddMenu && (
                    <div className="add-menu">
                        <div className="add-menu-header">
                            <span>Add to: {activeSystem?.bodies.find(b => b.id === selectedParentId)?.text || 'Root'}</span>
                            <button
                                className="close-menu-btn"
                                onClick={() => {
                                    setShowAddMenu(false);
                                    setSelectedParentId(null);
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <div className="add-options">
                            <button
                                className="add-option planet-option"
                                onClick={() => handleAddBody('planet')}
                            >
                                🪐 Add Planet
                            </button>
                            <button
                                className="add-option moon-option"
                                onClick={() => handleAddBody('moon')}
                            >
                                🌙 Add Moon
                            </button>
                        </div>
                    </div>
                )}

                <div className="bodies-tree">
                    {renderBodyTree(activeSystem?.bodies || [])}
                </div>
            </div>

            <div className="sidebar-footer">
                <div className="data-actions">
                    <button className="data-btn export-btn" onClick={onExport}>
                        📤 Export
                    </button>
                    <label className="data-btn import-btn">
                        📥 Import
                        <input
                            type="file"
                            accept=".json"
                            onChange={onImport}
                            style={{ display: 'none' }}
                        />
                    </label>
                </div>

                <div className="stats">
                    <div className="stat-item">
                        <span className="stat-label">Total Tasks:</span>
                        <span className="stat-value">{activeSystem?.bodies.length || 0}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Completed:</span>
                        <span className="stat-value">
                            {activeSystem?.bodies.filter(b => b.isCompleted).length || 0}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
