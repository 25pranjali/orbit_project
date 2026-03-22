# Advanced Features & Customization Guide

## 🎯 Feature Implementation Guide

This guide shows how to implement advanced features mentioned in the prompt.

---

## 1. Zoom and Pan Enhancement

### Current Implementation Status: ✅ COMPLETE

**Features Already Implemented:**
- Mouse wheel zoom (0.5x to 5x)
- Drag to pan
- Smooth lerp interpolation
- Zoom limits and boundaries

**Code Location:** [OrbitCanvas.js](src/components/OrbitCanvas.js#L1)

**Customization:**

Change zoom speed:
```javascript
// In handleWheel function
const zoomSpeed = 0.1;  // Increase for faster zoom
const delta = e.deltaY > 0 ? -zoomSpeed : zoomSpeed;
```

Change zoom limits:
```javascript
const newZoom = Math.max(0.3, Math.min(8, zoom + delta));  // 0.3 to 8x
```

Adjust camera smoothness:
```javascript
// In animation loop - higher value = faster response
currentCameraX += (targetCameraRef.current.x - currentCameraX) * 0.15;  // Was 0.1
```

---

## 2. Focus Mode Animation for Moons

### Current Implementation: 🟡 PARTIAL (Base structure ready)

**To Complete:**

Edit [OrbitCanvas.js](src/components/OrbitCanvas.js), add this after the calculatePosition function:

```javascript
// Calculate focused layout (vertical column)
const calculateFocusedPosition = useCallback((body, focusedParentId) => {
  if (body.parent !== focusedParentId) {
    return calculatePosition(body);
  }

  // Get all moons of focused parent
  const siblings = bodies.filter(b => b.parent === focusedParentId);
  const index = siblings.findIndex(b => b.id === body.id);
  
  // Arrange in vertical column
  const parentPos = calculatePosition(bodies.find(b => b.id === focusedParentId));
  const spacing = 60;
  const offset = (index - (siblings.length - 1) / 2) * spacing;

  return {
    x: parentPos.x + 100,
    y: parentPos.y + offset
  };
}, [bodies, calculatePosition]);
```

In the animation loop, blend between orbit and column positions:

```javascript
// Add after position calculation
let position = calculatePosition(body);
if (focusedBodyId && body.type === 'moon') {
  const focusedPos = calculateFocusedPosition(body, focusedBodyId);
  // Lerp between positions (smooth animation)
  position.x += (focusedPos.x - position.x) * 0.1;
  position.y += (focusedPos.y - position.y) * 0.1;
}
```

---

## 3. Click Detection Enhancement

### Current Implementation Status: ✅ COMPLETE

**Features Implemented:**
- Accurate click detection with radius
- Prevents selection during drag
- Shows closest body on overlapping clicks
- Visual feedback with glow effects

**Code Location:** [OrbitCanvas.js](src/components/OrbitCanvas.js) - handleCanvasClick

**Customization - Increase click area:**

```javascript
// In drawBody function
if (distance <= size + 20 && distance < maxDistance) {  // Was +10
  clickedBody = body;
  maxDistance = distance;
}
```

---

## 4. Futuristic UI Enhancements

### Current Implementation: ✅ COMPLETE

**Visual Features Already Implemented:**
- Dark space theme
- Glow effects on bodies
- Star field background
- Gradient buttons
- Cyan accent colors
- Smooth transitions
- Neon text effects

**Enhance Further:**

**Option 1: Add animated background**
```css
/* In App.css */
.canvas-container {
  background: 
    radial-gradient(ellipse at 20% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(255, 20, 147, 0.1) 0%, transparent 50%),
    #0a0e27;
  animation: nebula 20s ease infinite;
}

@keyframes nebula {
  0%, 100% { background-position: 0 0; }
  50% { background-position: 100px 100px; }
}
```

**Option 2: Add particles effect**
Add to [OrbitCanvas.js](src/components/OrbitCanvas.js):
```javascript
const drawParticles = useCallback((ctx, cameraX, cameraY, zoomLevel) => {
  ctx.fillStyle = 'rgba(0, 212, 255, 0.05)';
  for (let i = 0; i < 50; i++) {
    const x = (Math.sin(Date.now() * 0.0001 + i) * 500);
    const y = (Math.cos(Date.now() * 0.0001 + i) * 500);
    const screenX = (x + cameraX) * zoomLevel + ctx.canvas.width / 2;
    const screenY = (y + cameraY) * zoomLevel + ctx.canvas.height / 2;
    ctx.fillRect(screenX, screenY, 1, 1);
  }
}, []);
```

**Option 3: Add better shadows**
```css
.sidebar {
  box-shadow: 
    inset -10px 0 20px rgba(0, 212, 255, 0.1),
    inset -20px 0 40px rgba(0, 0, 0, 0.5);
}
```

---

## 5. Custom Color System

### Implementation Guide

Add to [App.js](src/App.js):

```javascript
// Add to state
const [bodyColors, setBodyColors] = useState({
  sun: '#FFD700',
  planet: '#FF1493',
  moon: '#7FFF00'
});

// Create color manager
const setBodyColor = useCallback((bodyId, color) => {
  updateBody(bodyId, { color });
}, [updateBody]);
```

Update [SidePanel.js](src/components/SidePanel.js) to add:

```javascript
<div className="panel-section">
  <div className="panel-label">Color</div>
  <input
    type="color"
    value={body.color}
    onChange={(e) => onUpdate(body.id, { color: e.target.value })}
    style={{ width: '50px', height: '30px', border: 'none', borderRadius: '4px' }}
  />
</div>
```

---

## 6. Multi-System Enhancement

### Current Implementation: ✅ COMPLETE (Base structure)

**To add UI for creating systems:**

Edit [Sidebar.js](src/components/Sidebar.js):

```javascript
const handleCreateSystem = () => {
  const name = prompt('New system name:');
  if (name) {
    // Add logic to create new system
  }
};

// In render, add button:
<button className="btn" onClick={handleCreateSystem}>
  ➕ New System
</button>
```

---

## 7. Drag & Rearrange Bodies

### Implementation for Future

Add to [OrbitCanvas.js](src/components/OrbitCanvas.js):

```javascript
const [isDraggingBody, setIsDraggingBody] = useState(null);
const [draggedPosition, setDraggedPosition] = useState(null);

const handleBodyDrag = useCallback((e) => {
  if (!isDraggingBody) return;
  
  const canvas = canvasRef.current;
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  
  // Convert screen space to world space
  const worldX = (mouseX - canvas.width / 2) / zoom - cameraPos.x;
  const worldY = (mouseY - canvas.height / 2) / zoom - cameraPos.y;
  
  setDraggedPosition({ x: worldX, y: worldY });
}, [isDraggingBody, zoom, cameraPos]);
```

---

## 8. Persistence (LocalStorage)

### Implementation Guide

Create new file: [src/hooks/useLocalStorage.js](src/hooks/useLocalStorage.js)

```javascript
import { useEffect, useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
```

Use in [App.js](src/App.js):

```javascript
import { useLocalStorage } from './hooks/useLocalStorage';

// Replace useState
const [systems, setSystems] = useLocalStorage('orbitSystems', [
  // ... initial data
]);
```

---

## 9. Export/Import Systems

### Implementation

Add to [Sidebar.js](src/components/Sidebar.js):

```javascript
const handleExport = () => {
  const dataStr = JSON.stringify(systems, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = 'orbit-systems.json';
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

const handleImport = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      // Merge or replace systems
      setSystems(prev => [...prev, ...imported]);
    } catch (error) {
      alert('Invalid file format');
    }
  };
  
  reader.readAsText(file);
};

// In JSX:
<button className="btn" onClick={handleExport}>📥 Export</button>
<input
  type="file"
  accept=".json"
  onChange={handleImport}
  style={{ display: 'none' }}
  id="import-file"
/>
<button className="btn" onClick={() => document.getElementById('import-file').click()}>
  📤 Import
</button>
```

---

## 10. Theme Customization

### Create Theme System

Create [src/themes/dark.js](src/themes/dark.js):

```javascript
export const darkTheme = {
  primary: '#00d4ff',
  secondary: '#FF1493',
  success: '#7FFF00',
  background: '#0a0e27',
  surface: '#1a1f3a',
  border: '#00d4ff',
  text: '#e0e6ff',
  textSecondary: '#a0a6ff',
  
  bodies: {
    sun: '#FFD700',
    planet: '#FF1493',
    moon: '#7FFF00'
  },
  
  glow: {
    amount: 15,
    blur: 20
  }
};

export const lightTheme = {
  primary: '#0066ff',
  secondary: '#ff6b6b',
  success: '#51cf66',
  background: '#ffffff',
  surface: '#f8f9fa',
  border: '#dee2e6',
  text: '#212529',
  textSecondary: '#6c757d',
  
  bodies: {
    sun: '#ffa500',
    planet: '#ff1493',
    moon: '#00aa00'
  },
  
  glow: {
    amount: 5,
    blur: 10
  }
};
```

Use in [App.js](src/App.js):

```javascript
import { darkTheme, lightTheme } from './themes/dark';

const [theme, setTheme] = useState('dark');
const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

// Pass theme to components via context or props
```

---

## 11. Performance Monitoring

### Add FPS Counter

```javascript
// In OrbitCanvas.js
const [fps, setFps] = useState(0);
let frameCount = 0;
let lastTime = performance.now();

useEffect(() => {
  const interval = setInterval(() => {
    const now = performance.now();
    const elapsed = now - lastTime;
    if (elapsed > 0) {
      setFps(Math.round(frameCount / (elapsed / 1000)));
      frameCount = 0;
      lastTime = now;
    }
  }, 1000);
  
  return () => clearInterval(interval);
}, []);

// In animation loop, increment frameCount
// frameCount++;

// Display: <div style={{ position: 'fixed', top: '10px', right: '10px' }}>FPS: {fps}</div>
```

---

## 12. Touch Support

### Add for Mobile

```javascript
// In OrbitCanvas.js
const handleTouchStart = (e) => {
  if (e.touches.length === 2) {
    // Two finger pinch for zoom
    const distance = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    touchDistanceRef.current = distance;
  }
};

const handleTouchMove = (e) => {
  if (e.touches.length === 2) {
    const distance = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    const delta = distance - touchDistanceRef.current;
    const zoomDelta = delta * 0.005;
    onZoomChange(Math.max(0.5, Math.min(5, zoom + zoomDelta)));
  }
};

// Attach handlers to canvas
```

---

## Quick Implementation Checklist

- [ ] Zoom/Pan - ✅ Done
- [ ] Click Detection - ✅ Done
- [ ] Focus Mode - 🟡 Structure ready, needs positioning
- [ ] Colors - ✅ Done (add picker in SidePanel)
- [ ] Dark Theme - ✅ Done (add toggle)
- [ ] Export/Import - 📋 See guide above
- [ ] LocalStorage - 📋 See guide above
- [ ] Touch Support - 📋 See guide above
- [ ] Performance Monitor - 📋 See guide above
- [ ] Theme System - 📋 See guide above

---

## Recommended Priority Order

1. **Test current features** - Ensure everything works
2. **Add persistence** - Save user data
3. **Add color picker** - Customize bodies
4. **Add theme toggle** - Dark/light modes
5. **Implement focus mode** - Vertical column layout
6. **Add export/import** - Share systems
7. **Performance monitor** - Debug optimization
8. **Touch support** - Mobile compatibility

---

**All features are modular and can be added independently!** 🚀
