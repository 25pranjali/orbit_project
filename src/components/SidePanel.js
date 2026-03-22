import React, { useState, useEffect } from 'react';

/**
 * SidePanel Component
 * Displays details and editing interface for selected moon/topic
 */
function SidePanel({ visible, body, onClose, onUpdate, onDelete, isEditing, editValue, onStartEdit, onEditChange, onSaveEdit, onCancelEdit }) {
    const [overview, setOverview] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    useEffect(() => {
        if (body) {
            setOverview(body.overview || '');
            setIsCompleted(body.isCompleted || false);
            setSaveMessage('');
        }
    }, [body]);

    useEffect(() => {
        let timeout;
        if (saveMessage) {
            timeout = setTimeout(() => setSaveMessage(''), 2000);
        }
        return () => clearTimeout(timeout);
    }, [saveMessage]);

    const handleSave = () => {
        if (body) {
            onUpdate(body.id, {
                overview,
                isCompleted
            });
            setSaveMessage('Saved!');
        }
    };

    const handleDelete = () => {
        if (body && window.confirm(`Delete "${body.text}"?`)) {
            onDelete(body.id);
            onClose();
        }
    };

    if (!body) return null;

    return (
        <div className={`side-panel ${visible ? 'visible' : ''}`}>
            <button className="panel-close" onClick={onClose}>✕</button>

            <div className="panel-title-section">
                {isEditing ? (
                    <div className="rename-input-group">
                        <input
                            type="text"
                            value={editValue}
                            onChange={(e) => onEditChange(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') onSaveEdit();
                                if (e.key === 'Escape') onCancelEdit();
                            }}
                            autoFocus
                            className="panel-rename-input"
                        />
                        <button className="btn-save-rename" onClick={onSaveEdit} title="Save">✓</button>
                        <button className="btn-cancel-rename" onClick={onCancelEdit} title="Cancel">✕</button>
                    </div>
                ) : (
                    <div className="panel-title-container">
                        <div className="panel-title">{body.text}</div>
                        <button className="btn-rename" onClick={() => onStartEdit(body.id)} title="Rename (double-click or click here)">
                            ✎
                        </button>
                    </div>
                )}
            </div>

            <div className="panel-section">
                <div className="panel-label">Status</div>
                <div className="toggle-complete">
                    <input
                        type="checkbox"
                        className="toggle-checkbox"
                        checked={isCompleted}
                        onChange={(e) => setIsCompleted(e.target.checked)}
                        id="complete-check"
                    />
                    <label htmlFor="complete-check" style={{ cursor: 'pointer', fontSize: '13px' }}>
                        {isCompleted ? '✓ Completed' : 'Mark Complete'}
                    </label>
                </div>
            </div>

            <div className="panel-section">
                <div className="panel-label">Notes</div>
                <textarea
                    className="panel-textarea"
                    value={overview}
                    onChange={(e) => setOverview(e.target.value)}
                    placeholder="Add notes or overview for this topic..."
                />
            </div>

            <div className="panel-actions">
                <button className="btn-small btn-save" onClick={handleSave}>
                    💾 Save
                </button>
                <button className="btn-small btn-delete" onClick={handleDelete}>
                    🗑️ Delete
                </button>
                {saveMessage && (
                    <span className="save-feedback" style={{ marginLeft: '10px', fontSize: '13px', color: '#7FFF00' }}>
                        {saveMessage}
                    </span>
                )}
            </div>

            <div style={{ marginTop: '20px', padding: '10px', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '5px', fontSize: '11px', color: '#a0a6ff' }}>
                <strong>Type:</strong> {body.type}<br />
                <strong>ID:</strong> {body.id}<br />
                <strong>Parent:</strong> {body.parent}
            </div>
        </div>
    );
}

export default SidePanel;
