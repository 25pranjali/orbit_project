import React from 'react';
import './SettingsPanel.css';

/**
 * SettingsPanel Component
 * Provides settings and configuration options
 */
function SettingsPanel({ settings, onSettingsChange, onClose }) {
    const updateSetting = (key, value) => {
        onSettingsChange({
            ...settings,
            [key]: value
        });
    };

    return (
        <div className="settings-panel-overlay" onClick={onClose}>
            <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
                <div className="settings-header">
                    <h3>Settings</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="settings-content">
                    <div className="setting-group">
                        <h4>Appearance</h4>

                        <div className="setting-item">
                            <label htmlFor="theme">Theme</label>
                            <select
                                id="theme"
                                value={settings.theme}
                                onChange={(e) => updateSetting('theme', e.target.value)}
                            >
                                <option value="dark">Dark</option>
                                <option value="light">Light</option>
                                <option value="auto">Auto</option>
                            </select>
                        </div>

                        <div className="setting-item">
                            <label htmlFor="animationSpeed">Animation Speed</label>
                            <div className="slider-container">
                                <input
                                    type="range"
                                    id="animationSpeed"
                                    min="0.1"
                                    max="3"
                                    step="0.1"
                                    value={settings.animationSpeed}
                                    onChange={(e) => updateSetting('animationSpeed', parseFloat(e.target.value))}
                                />
                                <span className="slider-value">{settings.animationSpeed}x</span>
                            </div>
                        </div>
                    </div>

                    <div className="setting-group">
                        <h4>Display</h4>

                        <div className="setting-item">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={settings.showOrbitPaths}
                                    onChange={(e) => updateSetting('showOrbitPaths', e.target.checked)}
                                />
                                Show Orbit Paths
                            </label>
                        </div>
                    </div>

                    <div className="setting-group">
                        <h4>Behavior</h4>

                        <div className="setting-item">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={settings.autoSave}
                                    onChange={(e) => updateSetting('autoSave', e.target.checked)}
                                />
                                Auto-save Progress
                            </label>
                        </div>

                        <div className="setting-item">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={settings.keyboardShortcuts}
                                    onChange={(e) => updateSetting('keyboardShortcuts', e.target.checked)}
                                />
                                Enable Keyboard Shortcuts
                            </label>
                        </div>
                    </div>

                    <div className="setting-group">
                        <h4>Keyboard Shortcuts</h4>
                        <div className="shortcuts-list">
                            <div className="shortcut-item">
                                <kbd>Ctrl+Z</kbd>
                                <span>Undo</span>
                            </div>
                            <div className="shortcut-item">
                                <kbd>Ctrl+Y</kbd>
                                <span>Redo</span>
                            </div>
                            <div className="shortcut-item">
                                <kbd>Ctrl+F</kbd>
                                <span>Search</span>
                            </div>
                            <div className="shortcut-item">
                                <kbd>Enter</kbd>
                                <span>Save Edit</span>
                            </div>
                            <div className="shortcut-item">
                                <kbd>Esc</kbd>
                                <span>Close Panels / Cancel Edit</span>
                            </div>
                        </div>
                    </div>

                    <div className="setting-group">
                        <h4>Data Management</h4>
                        <div className="data-actions">
                            <button
                                className="data-btn export-btn"
                                onClick={() => {
                                    const dataStr = JSON.stringify(settings, null, 2);
                                    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
                                    const linkElement = document.createElement('a');
                                    linkElement.setAttribute('href', dataUri);
                                    linkElement.setAttribute('download', 'orbit-settings.json');
                                    linkElement.click();
                                }}
                            >
                                Export Settings
                            </button>

                            <button
                                className="data-btn reset-btn"
                                onClick={() => {
                                    if (window.confirm('Reset all settings to default?')) {
                                        onSettingsChange({
                                            theme: 'dark',
                                            animationSpeed: 1,
                                            showOrbitPaths: true,
                                            autoSave: true,
                                            keyboardShortcuts: true
                                        });
                                    }
                                }}
                            >
                                Reset to Default
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsPanel;