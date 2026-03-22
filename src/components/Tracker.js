import React, { useMemo } from 'react';

/**
 * Tracker Component
 * Shows progress and hierarchical tree visualization
 */
function Tracker({ bodies, onBodyUpdate }) {
    const stats = useMemo(() => {
        const suns = bodies.filter(b => b.type === 'sun');
        const planets = bodies.filter(b => b.type === 'planet');
        const moons = bodies.filter(b => b.type === 'moon');
        const completedMoons = moons.filter(b => b.isCompleted);

        return {
            totalTopics: moons.length,
            completedTopics: completedMoons.length,
            percentage: moons.length > 0 ? Math.round((completedMoons.length / moons.length) * 100) : 0,
            suns,
            planets,
            moons
        };
    }, [bodies]);

    const getBodyById = (id) => bodies.find(b => b.id === id);

    const renderTreeNode = (body, level = 0) => {
        if (body.type === 'sun') {
            return (
                <div key={body.id}>
                    <div className="tree-node" style={{ marginLeft: 0, borderLeft: 'none' }}>
                        <div className={`tree-node-text ${body.isCompleted ? 'tree-node-completed' : ''}`}>
                            ☀️ {body.text}
                        </div>
                    </div>
                    {bodies
                        .filter(b => b.parent === body.id)
                        .map(planet => renderTreeNode(planet, 1))}
                </div>
            );
        }

        if (body.type === 'planet') {
            return (
                <div key={body.id}>
                    <div className="tree-node">
                        <div className={`tree-node-text ${body.isCompleted ? 'tree-node-completed' : ''}`}>
                            🪐 {body.text}
                        </div>
                    </div>
                    {bodies
                        .filter(b => b.parent === body.id)
                        .map(moon => renderTreeNode(moon, 2))}
                </div>
            );
        }

        if (body.type === 'moon') {
            return (
                <div key={body.id} className="tree-node">
                    <div className={`tree-node-text ${body.isCompleted ? 'tree-node-completed' : 'tree-node-pending'}`}>
                        <input
                            type="checkbox"
                            checked={body.isCompleted}
                            onChange={() => onBodyUpdate(body.id, { isCompleted: !body.isCompleted })}
                            style={{ marginRight: '8px', cursor: 'pointer' }}
                        />
                        🌙 {body.text}
                    </div>
                    {body.overview && (
                        <div style={{ fontSize: '12px', color: '#7FFF00', marginTop: '5px', marginLeft: '20px', opacity: 0.8 }}>
                            {body.overview}
                        </div>
                    )}
                </div>
            );
        }
    };

    return (
        <div className="tracker-container">
            <div className="tracker-header">
                <div className="tracker-title">📊 Progress Tracker</div>
            </div>

            <div className="progress-section">
                <div className="progress-stats">
                    <div className="stat-box">
                        <div className="stat-number">{stats.totalTopics}</div>
                        <div className="stat-label">Total Topics</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-number">{stats.completedTopics}</div>
                        <div className="stat-label">Completed</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-number">{stats.percentage}%</div>
                        <div className="stat-label">Progress</div>
                    </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <div className="panel-label">Overall Progress</div>
                    <div className="progress-bar-container">
                        <div
                            className="progress-bar"
                            style={{ width: `${stats.percentage}%` }}
                        >
                            {stats.percentage > 10 && `${stats.percentage}%`}
                        </div>
                    </div>
                </div>
            </div>

            <div className="tree-container">
                <div className="tree-title">System Hierarchy</div>
                {stats.suns.map(sun => renderTreeNode(sun))}
            </div>
        </div>
    );
}

export default Tracker;
