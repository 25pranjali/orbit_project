import React, { useRef, useEffect, useState, useCallback } from 'react';

/**
 * OrbitCanvas Component
 * Renders the solar system with orbiting planets and moons
 * Handles zoom, pan, and click detection
 */
function OrbitCanvas({
    bodies,
    selectedBodyId,
    focusedBodyId,
    onBodySelect,
    cameraPos,
    onCameraChange,
    zoom,
    onZoomChange,
    onStartEdit
}) {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const anglesRef = useRef({});
    const targetCameraRef = useRef({ x: cameraPos.x, y: cameraPos.y });
    const targetZoomRef = useRef(zoom);
    const lastClickRef = useRef({ body: null, time: 0 });

    // Initialize angles for each body
    useEffect(() => {
        bodies.forEach(body => {
            if (!anglesRef.current[body.id]) {
                anglesRef.current[body.id] = body.angle;
            }
        });
    }, [bodies]);

    // Smooth camera interpolation
    useEffect(() => {
        targetCameraRef.current = cameraPos;
    }, [cameraPos]);

    useEffect(() => {
        targetZoomRef.current = zoom;
    }, [zoom]);

    // Generate starfield background
    const generateStars = useCallback(() => {
        const stars = [];
        for (let i = 0; i < 200; i++) {
            stars.push({
                x: Math.random() * 2000 - 1000,
                y: Math.random() * 2000 - 1000,
                size: Math.random() * 1.5,
                opacity: Math.random() * 0.7 + 0.3
            });
        }
        return stars;
    }, []);

    const starsRef = useRef(generateStars());

    // Get body by id
    const getBodyById = useCallback((id) => {
        return bodies.find(b => b.id === id);
    }, [bodies]);

    // Calculate position based on parent and angle
    const calculatePosition = useCallback((body) => {
        if (body.type === 'sun') {
            return { x: 0, y: 0 };
        }

        const parent = getBodyById(body.parent);
        if (!parent) return { x: 0, y: 0 };

        const parentPos = calculatePosition(parent);
        const angle = anglesRef.current[body.id] || 0;

        return {
            x: parentPos.x + Math.cos(angle) * body.orbitRadius,
            y: parentPos.y + Math.sin(angle) * body.orbitRadius
        };
    }, [getBodyById]);

    // Draw a body (circle with glow)
    const drawBody = useCallback((ctx, body, position, isSelected, isFocused, cameraX, cameraY, zoomLevel) => {
        const screenX = (position.x + cameraX) * zoomLevel + ctx.canvas.width / 2;
        const screenY = (position.y + cameraY) * zoomLevel + ctx.canvas.height / 2;

        let size = 8;
        if (body.type === 'sun') size = 20;
        if (body.type === 'planet') size = 14;

        // Draw glow
        const glowColor = isSelected || isFocused ? 'rgba(0, 255, 255, 0.5)' : `rgba(${hexToRgb(body.color).join(',')}, 0.2)`;
        const glowRadius = size + (isSelected || isFocused ? 15 : 8);

        const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, glowRadius);
        gradient.addColorStop(0, glowColor);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(screenX - glowRadius, screenY - glowRadius, glowRadius * 2, glowRadius * 2);

        // Draw body
        ctx.fillStyle = body.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
        ctx.fill();

        // Draw border for selected/focused
        if (isSelected || isFocused) {
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Draw completed indicator
        if (body.isCompleted) {
            ctx.strokeStyle = '#7FFF00';
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // Update body position in ref for click detection
        if (!body._screenPos) {
            body._screenPos = {};
        }
        body._screenPos = { x: screenX, y: screenY, size };
    }, []);

    // Draw orbit path
    const drawOrbit = useCallback((ctx, body, cameraX, cameraY, zoomLevel) => {
        if (body.type === 'sun' || !body.parent) return;

        const parentPos = calculatePosition(getBodyById(body.parent));
        const screenParentX = (parentPos.x + cameraX) * zoomLevel + ctx.canvas.width / 2;
        const screenParentY = (parentPos.y + cameraY) * zoomLevel + ctx.canvas.height / 2;

        ctx.strokeStyle = `rgba(${hexToRgb(body.color).join(',')}, 0.2)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(screenParentX, screenParentY, body.orbitRadius * zoomLevel, 0, Math.PI * 2);
        ctx.stroke();
    }, [calculatePosition, getBodyById]);

    // Draw stars
    const drawStars = useCallback((ctx, cameraX, cameraY, zoomLevel) => {
        starsRef.current.forEach(star => {
            const screenX = (star.x + cameraX) * zoomLevel + ctx.canvas.width / 2;
            const screenY = (star.y + cameraY) * zoomLevel + ctx.canvas.height / 2;

            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fillRect(screenX - star.size / 2, screenY - star.size / 2, star.size, star.size);
        });
    }, []);

    // Main animation loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let currentCameraX = cameraPos.x;
        let currentCameraY = cameraPos.y;
        let currentZoom = zoom;

        const animate = () => {
            // Update angles for rotation
            bodies.forEach(body => {
                if (!anglesRef.current[body.id]) {
                    anglesRef.current[body.id] = body.angle;
                }
                anglesRef.current[body.id] += body.speed * 0.01;
            });

            // Smooth camera interpolation (lerp)
            currentCameraX += (targetCameraRef.current.x - currentCameraX) * 0.1;
            currentCameraY += (targetCameraRef.current.y - currentCameraY) * 0.1;
            currentZoom += (targetZoomRef.current - currentZoom) * 0.1;

            // Clear canvas
            ctx.fillStyle = '#0a0e27';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw background stars
            drawStars(ctx, currentCameraX, currentCameraY, currentZoom);

            // Draw orbits first (so they appear behind bodies)
            bodies.forEach(body => {
                drawOrbit(ctx, body, currentCameraX, currentCameraY, currentZoom);
            });

            // Sort bodies by distance (depth sorting)
            const sortedBodies = [...bodies].sort((a, b) => {
                const posA = calculatePosition(a);
                const posB = calculatePosition(b);
                const distA = Math.sqrt(posA.x ** 2 + posA.y ** 2);
                const distB = Math.sqrt(posB.x ** 2 + posB.y ** 2);
                return distA - distB;
            });

            // Draw bodies
            sortedBodies.forEach(body => {
                const position = calculatePosition(body);
                const isSelected = body.id === selectedBodyId;
                const isFocused = body.id === focusedBodyId;
                drawBody(ctx, body, position, isSelected, isFocused, currentCameraX, currentCameraY, currentZoom);
            });

            // Draw labels for sun and planets
            sortedBodies.forEach(body => {
                if (body.type !== 'moon') {
                    const position = calculatePosition(body);
                    const screenX = (position.x + currentCameraX) * currentZoom + ctx.canvas.width / 2;
                    const screenY = (position.y + currentCameraY) * currentZoom + ctx.canvas.height / 2;

                    ctx.fillStyle = body.color;
                    ctx.font = 'bold 12px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(body.text, screenX, screenY + 35);
                }
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        // Handle canvas resize
        const handleResize = () => {
            const isMobile = window.innerWidth <= 768;
            canvas.width = isMobile ? window.innerWidth : window.innerWidth - 250; 
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [bodies, selectedBodyId, focusedBodyId, drawBody, drawOrbit, drawStars, calculatePosition, cameraPos, zoom]);

    // Mouse wheel zoom
    const handleWheel = useCallback((e) => {
        e.preventDefault();
        const zoomSpeed = 0.1;
        const delta = e.deltaY > 0 ? -zoomSpeed : zoomSpeed;
        const newZoom = Math.max(0.5, Math.min(5, zoom + delta));
        onZoomChange(newZoom);
    }, [zoom, onZoomChange]);

    // Mouse down for dragging
    const handleMouseDown = useCallback((e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
    }, []);

    // Mouse move for dragging
    const handleMouseMove = useCallback((e) => {
        if (isDragging) {
            const dx = (e.clientX - dragStart.x) / zoom;
            const dy = (e.clientY - dragStart.y) / zoom;
            onCameraChange({
                x: cameraPos.x + dx,
                y: cameraPos.y + dy
            });
            setDragStart({ x: e.clientX, y: e.clientY });
        }
    }, [isDragging, dragStart, zoom, cameraPos, onCameraChange]);

    // Mouse up to stop dragging
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Click to select body
    const handleCanvasClick = useCallback((e) => {
        if (isDragging) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Find clicked body
        let clickedBody = null;
        let maxDistance = 20;

        bodies.forEach(body => {
            if (body._screenPos) {
                const { x: screenX, y: screenY, size } = body._screenPos;
                const distance = Math.sqrt((clickX - screenX) ** 2 + (clickY - screenY) ** 2);

                if (distance <= size + 10 && distance < maxDistance) {
                    clickedBody = body;
                    maxDistance = distance;
                }
            }
        });

        if (clickedBody) {
            const currentTime = Date.now();

            // Check for double-click (within 300ms)
            if (lastClickRef.current.body?.id === clickedBody.id && currentTime - lastClickRef.current.time < 300) {
                // Double-click: start editing
                if (onStartEdit) {
                    onStartEdit(clickedBody.id);
                }
                lastClickRef.current = { body: null, time: 0 };
            } else {
                // Single click: select body
                onBodySelect(clickedBody.id);
                lastClickRef.current = { body: clickedBody, time: currentTime };
            }
        } else {
            // Reset to system view if clicking empty space
            onBodySelect(null);
            lastClickRef.current = { body: null, time: 0 };
        }
    }, [bodies, isDragging, onBodySelect, onStartEdit]);

    // Touch events for mobile
    const handleTouchStart = useCallback((e) => {
        if (e.touches.length === 1) {
            setIsDragging(true);
            setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        }
    }, []);

    const handleTouchMove = useCallback((e) => {
        if (isDragging && e.touches.length === 1) {
            e.preventDefault(); // Prevent scrolling
            const dx = (e.touches[0].clientX - dragStart.x) / zoom;
            const dy = (e.touches[0].clientY - dragStart.y) / zoom;
            onCameraChange({
                x: cameraPos.x + dx,
                y: cameraPos.y + dy
            });
            setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        }
    }, [isDragging, dragStart, zoom, cameraPos, onCameraChange]);

    const handleTouchEnd = useCallback((e) => {
        if (isDragging) {
            setIsDragging(false);
            
            // Handle tap-to-select if it wasn't a significant drag
            if (e.changedTouches.length === 1) {
                const canvas = canvasRef.current;
                const rect = canvas.getBoundingClientRect();
                const clickX = e.changedTouches[0].clientX - rect.left;
                const clickY = e.changedTouches[0].clientY - rect.top;

                let clickedBody = null;
                let maxDistance = 30; // Slightly larger for touch

                bodies.forEach(body => {
                    if (body._screenPos) {
                        const { x: screenX, y: screenY, size } = body._screenPos;
                        const distance = Math.sqrt((clickX - screenX) ** 2 + (clickY - screenY) ** 2);

                        if (distance <= size + 15 && distance < maxDistance) {
                            clickedBody = body;
                            maxDistance = distance;
                        }
                    }
                });

                if (clickedBody) {
                    onBodySelect(clickedBody.id);
                }
            }
        }
    }, [isDragging, bodies, onBodySelect]);

    return (
        <div
            className="canvas-container"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleCanvasClick}
        >
            <canvas ref={canvasRef} />
        </div>
    );
}

// Helper function to convert hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : [0, 212, 255];
}

export default OrbitCanvas;
