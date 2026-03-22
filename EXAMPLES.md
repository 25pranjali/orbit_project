# Code Examples & Component API Reference

## Component Props Reference

### OrbitCanvas Component

```javascript
<OrbitCanvas
  bodies={body[]}                    // Array of all bodies (suns, planets, moons)
  selectedBodyId={string}            // ID of currently selected body
  focusedBodyId={string}             // ID of body in focus mode
  onBodySelect={(bodyId) => {}}      // Callback when body is clicked
  cameraPos={{ x: number, y: number }} // Camera position in world space
  onCameraChange={(pos) => {}}       // Callback for camera movement
  zoom={number}                      // Camera zoom level (0.5-5)
  onZoomChange={(zoom) => {}}        // Callback for zoom changes
/>
```

### Sidebar Component

```javascript
<Sidebar
  systems={System[]}                 // Array of all systems
  activeSystemId={string}            // Currently active system ID
  onSystemChange={(id) => {}}        // Callback to switch system
  onAddBody={(parentId, type) => {}} // Callback to create new body
  currentPage={string}               // 'orbit' | 'tracker' | 'journal'
  onPageChange={(page) => {}}        // Callback to switch page
/>
```

### SidePanel Component

```javascript
<SidePanel
  visible={boolean}                  // Show/hide panel
  body={Body}                        // Currently editing body
  onClose={() => {}}                 // Callback to close
  onUpdate={(bodyId, updates) => {}} // Callback to save changes
  onDelete={(bodyId) => {}}          // Callback to delete body
/>
```

### Tracker Component

```javascript
<Tracker
  bodies={Body[]}                    // All bodies in system
  onBodyUpdate={(id, updates) => {}} // Callback to update body
/>
```

### Journal Component

```javascript
<Journal
  bodies={Body[]}                    // All bodies in system
  onBodyUpdate={(id, updates) => {}} // Callback to update body
/>
```

---

## Data Structure Examples

### Full System Example

```javascript
const system = {
  id: 'system-1',
  name: 'Web Development Path',
  bodies: [
    // SUN (Core/Subject)
    {
      id: 'sun-1',
      text: 'Web Development Mastery',
      type: 'sun',
      parent: null,
      orbitRadius: 0,
      angle: 0,
      speed: 0,
      position: { x: 0, y: 0 },
      color: '#FFD700',
      isCompleted: false,
      overview: 'Complete web development learning path'
    },
    
    // PLANET (Module/Subject)
    {
      id: 'planet-1',
      text: 'Frontend Technologies',
      type: 'planet',
      parent: 'sun-1',
      orbitRadius: 120,
      angle: 0,
      speed: 0.8,
      position: { x: 120, y: 0 },
      color: '#00D4FF',
      isCompleted: false,
      overview: 'Learn all frontend technologies'
    },
    
    // MOON (Topic/Task) - Child of planet-1
    {
      id: 'moon-1',
      text: 'HTML & Semantics',
      type: 'moon',
      parent: 'planet-1',
      orbitRadius: 60,
      angle: 0,
      speed: 1.5,
      position: { x: 180, y: 0 },
      color: '#7FFF00',
      isCompleted: true,
      overview: 'Learn semantic HTML5 and accessibility best practices'
    },
    
    {
      id: 'moon-2',
      text: 'CSS & Styling',
      type: 'moon',
      parent: 'planet-1',
      orbitRadius: 60,
      angle: 2.1,
      speed: 1.5,
      position: { x: 180, y: 0 },
      color: '#00FF7F',
      isCompleted: false,
      overview: 'Master CSS Grid, Flexbox, and animations'
    },
    
    // PLANET 2
    {
      id: 'planet-2',
      text: 'JavaScript & Frameworks',
      type: 'planet',
      parent: 'sun-1',
      orbitRadius: 200,
      angle: Math.PI,
      speed: 0.5,
      position: { x: -200, y: 0 },
      color: '#FF1493',
      isCompleted: false,
      overview: 'Master JavaScript and modern frameworks'
    },
    
    // MOONS under planet-2
    {
      id: 'moon-3',
      text: 'Core JavaScript',
      type: 'moon',
      parent: 'planet-2',
      orbitRadius: 70,
      angle: 0,
      speed: 1.5,
      position: { x: -270, y: 0 },
      color: '#FF69B4',
      isCompleted: false,
      overview: 'ES6+, async/await, destructuring, etc.'
    },
    
    {
      id: 'moon-4',
      text: 'React Framework',
      type: 'moon',
      parent: 'planet-2',
      orbitRadius: 70,
      angle: 2.5,
      speed: 1.5,
      position: { x: -270, y: 0 },
      color: '#FF69B4',
      isCompleted: true,
      overview: 'Hooks, functional components, context API'
    }
  ]
};
```

### Body Creation Patterns

```javascript
// Create a new SUN
const newSun = {
  id: `sun-${Date.now()}`,
  text: 'My New Learning Path',
  type: 'sun',
  parent: null,
  orbitRadius: 0,
  angle: 0,
  speed: 0,
  position: { x: 0, y: 0 },
  color: '#FFD700',
  isCompleted: false,
  overview: ''
};

// Create a new PLANET (child of sun)
const newPlanet = {
  id: `planet-${Date.now()}`,
  text: 'My Module',
  type: 'planet',
  parent: 'sun-1', // Reference parent sun ID
  orbitRadius: 120,
  angle: Math.random() * Math.PI * 2,
  speed: 0.8,
  position: { x: 120, y: 0 }, // Calculated based on parent
  color: '#FF1493',
  isCompleted: false,
  overview: ''
};

// Create a new MOON (child of planet)
const newMoon = {
  id: `moon-${Date.now()}`,
  text: 'My Topic',
  type: 'moon',
  parent: 'planet-1', // Reference parent planet ID
  orbitRadius: 60,
  angle: Math.random() * Math.PI * 2,
  speed: 1.5,
  position: { x: 180, y: 0 }, // Calculated based on parent
  color: '#7FFF00',
  isCompleted: false,
  overview: ''
};
```

---

## Common Operations

### Adding a Body

```javascript
const addBody = useCallback((parentId, bodyType) => {
  setSystems(prev => prev.map(system => {
    if (system.id !== activeSystemId) return system;

    const newId = `${bodyType}-${Date.now()}`;
    const newBody = {
      id: newId,
      text: `New ${bodyType.charAt(0).toUpperCase() + bodyType.slice(1)}`,
      type: bodyType,
      parent: parentId,
      orbitRadius: bodyType === 'moon' ? 60 : 120,
      angle: Math.random() * Math.PI * 2,
      speed: bodyType === 'moon' ? 1.5 : 0.8,
      position: { x: 0, y: 0 },
      color: bodyType === 'moon' ? '#7FFF00' : '#FF1493',
      isCompleted: false,
      overview: ''
    };

    return {
      ...system,
      bodies: [...system.bodies, newBody]
    };
  }));
}, [activeSystemId]);
```

### Updating a Body

```javascript
const updateBody = useCallback((bodyId, updates) => {
  setSystems(prev => prev.map(system => {
    if (system.id !== activeSystemId) return system;
    return {
      ...system,
      bodies: system.bodies.map(body =>
        body.id === bodyId ? { ...body, ...updates } : body
      )
    };
  }));
}, [activeSystemId]);

// Usage:
updateBody('moon-1', { isCompleted: true, overview: 'Updated notes' });
```

### Deleting a Body (with children)

```javascript
const deleteBody = useCallback((bodyId) => {
  setSystems(prev => prev.map(system => {
    if (system.id !== activeSystemId) return system;
    
    const childrenToRemove = new Set();
    const addChildren = (parentId) => {
      system.bodies.forEach(body => {
        if (body.parent === parentId) {
          childrenToRemove.add(body.id);
          addChildren(body.id); // Recursive
        }
      });
    };
    
    addChildren(bodyId);
    childrenToRemove.add(bodyId);

    return {
      ...system,
      bodies: system.bodies.filter(b => !childrenToRemove.has(b.id))
    };
  }));
}, [activeSystemId]);

// Usage:
deleteBody('planet-1'); // Removes planet AND all its moons
```

### Getting Body Hierarchy

```javascript
const getBodyHierarchy = (bodies, bodyId) => {
  const body = bodies.find(b => b.id === bodyId);
  if (!body || !body.parent) return [body];
  
  const parent = bodies.find(b => b.id === body.parent);
  return parent 
    ? [parent, ...getBodyHierarchy(bodies, body.parent)]
    : [body];
};

// Usage:
const lineage = getBodyHierarchy(bodies, 'moon-1');
// Result: [Sun, Planet, Moon]
```

### Getting All Children

```javascript
const getChildren = (bodies, parentId) => {
  return bodies.filter(b => b.parent === parentId);
};

// Usage:
const moonUnderPlanet = getChildren(bodies, 'planet-1');
```

### Calculate Completion Percentage

```javascript
const getProgressStats = (bodies) => {
  const moons = bodies.filter(b => b.type === 'moon');
  const completedMoons = moons.filter(b => b.isCompleted);
  
  return {
    total: moons.length,
    completed: completedMoons.length,
    percentage: moons.length > 0 
      ? Math.round((completedMoons.length / moons.length) * 100)
      : 0
  };
};

// Usage:
const { total, completed, percentage } = getProgressStats(bodies);
```

---

## Canvas Rendering Examples

### Custom Body Rendering

```javascript
const drawBody = (ctx, body, position, screenX, screenY) => {
  let size = 8;
  if (body.type === 'sun') size = 20;
  if (body.type === 'planet') size = 14;

  // Draw glow
  const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, size + 8);
  gradient.addColorStop(0, `${body.color}40`);
  gradient.addColorStop(1, `${body.color}00`);
  ctx.fillStyle = gradient;
  ctx.fillRect(screenX - (size + 8), screenY - (size + 8), (size + 8) * 2, (size + 8) * 2);

  // Draw body
  ctx.fillStyle = body.color;
  ctx.beginPath();
  ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
  ctx.fill();
};
```

### Custom Orbit Path

```javascript
const drawOrbit = (ctx, parentPos, orbitRadius, color) => {
  ctx.strokeStyle = `${color}30`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(parentPos.x, parentPos.y, orbitRadius, 0, Math.PI * 2);
  ctx.stroke();
};
```

### World to Screen Conversion

```javascript
const worldToScreen = (worldX, worldY, cameraX, cameraY, zoom, canvasWidth, canvasHeight) => {
  const screenX = (worldX + cameraX) * zoom + canvasWidth / 2;
  const screenY = (worldY + cameraY) * zoom + canvasHeight / 2;
  return { screenX, screenY };
};

// Usage:
const { screenX, screenY } = worldToScreen(x, y, cameraPos.x, cameraPos.y, zoom, width, height);
```

### Screen to World Conversion

```javascript
const screenToWorld = (screenX, screenY, cameraX, cameraY, zoom, canvasWidth, canvasHeight) => {
  const worldX = (screenX - canvasWidth / 2) / zoom - cameraX;
  const worldY = (screenY - canvasHeight / 2) / zoom - cameraY;
  return { worldX, worldY };
};

// Usage:
const { worldX, worldY } = screenToWorld(mouseX, mouseY, cameraPos.x, cameraPos.y, zoom, width, height);
```

---

## State Management Patterns

### Immutable Array Updates

```javascript
// Adding an item
const newArray = [...oldArray, newItem];

// Updating an item
const updatedArray = oldArray.map(item =>
  item.id === targetId ? { ...item, ...updates } : item
);

// Removing an item
const filteredArray = oldArray.filter(item => item.id !== targetId);

// Nested update
const nestedUpdate = oldArray.map(system => ({
  ...system,
  bodies: system.bodies.map(body =>
    body.id === targetId ? { ...body, ...updates } : body
  )
}));
```

### useCallback Dependencies

```javascript
// Correctly memoized function
const memoizedFunction = useCallback((arg) => {
  // Do something with arg and dependencies
}, [dependency1, dependency2]); // List all used state/props
```

---

## Event Handler Examples

### Mouse Wheel Zoom

```javascript
const handleWheel = useCallback((e) => {
  e.preventDefault();
  const zoomSpeed = 0.1;
  const delta = e.deltaY > 0 ? -zoomSpeed : zoomSpeed;
  const newZoom = Math.max(0.5, Math.min(5, zoom + delta));
  onZoomChange(newZoom);
}, [zoom, onZoomChange]);
```

### Mouse Drag Pan

```javascript
const [isDragging, setIsDragging] = useState(false);
const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

const handleMouseDown = useCallback((e) => {
  setIsDragging(true);
  setDragStart({ x: e.clientX, y: e.clientY });
}, []);

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

const handleMouseUp = useCallback(() => {
  setIsDragging(false);
}, []);
```

---

## CSS Examples

### Button Hover Effect

```css
.btn {
  background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(0, 212, 255, 0.5);
  background: linear-gradient(135deg, #00ffff 0%, #00d4ff 100%);
}
```

### Gradient Text Effect

```css
.title {
  background: linear-gradient(135deg, #00d4ff 0%, #7FFF00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
}
```

### Smooth Scrollbar

```css
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 212, 255, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 212, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 212, 255, 0.5);
}
```

---

## Testing & Debugging

### Console Logging Body State

```javascript
console.log('Current System:', activeSystem);
console.log('All Bodies:', bodies);
console.log('Selected:', selectedBodyId);
console.log('Camera:', cameraPos, 'Zoom:', zoom);
```

### Validate Body Data

```javascript
const validateBody = (body) => {
  const required = ['id', 'text', 'type', 'parent', 'color', 'position', 'isCompleted'];
  const missing = required.filter(field => !(field in body));
  if (missing.length > 0) {
    console.warn(`Body ${body.id} missing fields:`, missing);
    return false;
  }
  return true;
};
```

---

**These examples show common patterns used throughout the application!** 🚀
