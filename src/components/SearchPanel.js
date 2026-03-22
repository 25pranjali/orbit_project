import React, { useState, useEffect } from 'react';
import './SearchPanel.css';

/**
 * SearchPanel Component
 * Provides search functionality across all bodies in the system
 */
function SearchPanel({ bodies, onBodySelect, onClose }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredBodies, setFilteredBodies] = useState([]);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredBodies([]);
        } else {
            const filtered = bodies.filter(body =>
                body.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                body.overview.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredBodies(filtered);
        }
    }, [searchTerm, bodies]);

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    return (
        <div className="search-panel-overlay" onClick={onClose}>
            <div className="search-panel" onClick={(e) => e.stopPropagation()}>
                <div className="search-header">
                    <h3>Search Bodies</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="search-input-container">
                    <input
                        type="text"
                        placeholder="Search tasks, planets, moons..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                </div>

                <div className="search-results">
                    {filteredBodies.length === 0 && searchTerm.trim() !== '' && (
                        <div className="no-results">No bodies found matching "{searchTerm}"</div>
                    )}

                    {filteredBodies.map(body => (
                        <div
                            key={body.id}
                            className={`search-result-item ${body.type}`}
                            onClick={() => onBodySelect(body.id)}
                        >
                            <div className="body-icon" style={{ backgroundColor: body.color }}>
                                {body.type === 'sun' && '☀️'}
                                {body.type === 'planet' && '🪐'}
                                {body.type === 'moon' && '🌙'}
                            </div>
                            <div className="body-info">
                                <div className="body-name">{body.text}</div>
                                <div className="body-type">{body.type.charAt(0).toUpperCase() + body.type.slice(1)}</div>
                                {body.overview && (
                                    <div className="body-overview">{body.overview}</div>
                                )}
                            </div>
                            <div className={`completion-status ${body.isCompleted ? 'completed' : 'pending'}`}>
                                {body.isCompleted ? '✓' : '○'}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="search-footer">
                    <div className="search-shortcuts">
                        <span>↑↓ Navigate • Enter Select • Esc Close</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchPanel;