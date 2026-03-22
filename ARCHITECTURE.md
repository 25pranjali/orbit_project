# Architecture & Implementation Guide

## System Overview

The Orbit Task Manager is a React application that visualizes task organization as a solar system:

```
SUN (Core/Subject)
├── PLANET 1 (Module)
│   ├── MOON 1 (Topic/Task)
│   ├── MOON 2 (Topic/Task)
│   └── MOON 3 (Topic/Task)
├── PLANET 2 (Module)
│   ├── MOON 1 (Topic/Task)
│   └── MOON 2 (Topic/Task)
```

## Data Flow

```
App.js (State Management)
  ├── systems[] (multiple solar systems)
  └── bodies[] (suns, planets, moons)
      ├── OrbitCanvas (Display & Interaction)
      ├── SidePanel (Details & Editing)
      ├── Sidebar (Navigation)
      ├── Tracker (Statistics)
      └── Journal (Task List)
```

## Core Components

### 1. App.js - Main Controller

**Responsibilities:**
- Manages global state (systems, bodies)
- Handles add/update/delete operations
- Manages page navigation (orbit, tracker, journal)
- Controls side panel visibility
- Tracks selected and focused bodies

**Key State:**
```javascript
systems[]       // Array of solar systems
activeSystemId  // Currently viewing system
selectedBodyId  // Currently selected body
focusedBodyId   // Body in focus mode
cameraPos       // Camera x, y coordinates
zoom            // Camera zoom level (0.5 - 5)
currentPage     // 'orbit' | 'tracker' | 'journal'
sidePanel       // { visible: bool, bodyId: string }
```

**Key Methods:**
- `addBody(parentId, bodyType)` - Create new body
- `handleBodySelect(bodyId)` - Select body, open panel
- `updateBody(bodyId, updates)` - Modify body properties
- `deleteBody(bodyId)` - Remove body and children

### 2. OrbitCanvas.js - Rendering Engine

**Responsibilities:**
- Render celestial bodies with Canvas API
- Animate orbital motion
- Handle camera zoom and pan
- Detect click interactions
- Draw starfield and orbit paths

**Key Features:**

**Animation Loop (requestAnimationFrame)**
```javascript
// Updates every frame (~60 FPS)
anglesRef.current[body.id] += body.speed * 0.01
// Smooth camera lerp (linear interpolation)
currentCameraX += (targetCameraX - currentCameraX) * 0.1
```

**Position Calculation**
```javascript
function calculatePosition(body) {
  if (body.type === 'sun') return { x: 0, y: 0 }
  
  const parent = getBodyById(body.parent)
  const parentPos = calculatePosition(parent)
  const angle = anglesRef.current[body.id]
  
  return {
    x: parentPos.x + Math.cos(angle) * body.orbitRadius,
    y: parentPos.y + Math.sin(angle) * body.orbitRadius
  }
}
```

**Screen Space Conversion**
```javascript
// World space to screen space
screenX = (worldX + cameraX) * zoom + canvas.width / 2
screenY = (worldY + cameraY) * zoom + canvas.height / 2
```

**Click Detection**
```javascript
// Calculate distance to each body in screen space
distance = Math.sqrt((clickX - screenX)² + (clickY - screenY)²)
// Select if within click radius (size + 10px)
if (distance <= size + 10) selectedBody = body
```

**Camera System**
- **Zoom**: Mouse wheel adjusts zoom level (0.5x - 5x)
- **Pan**: Mouse drag moves camera position
- **Lerp**: Smooth 10% interpolation each frame for fluid motion
- **Focus**: Auto-center on selected body

### 3. Sidebar.js - Navigation

**Renders:**
- System selection tabs
- Add Planet / Add Topic buttons
- Page navigation (Orbit, Tracker, Journal)
- System statistics (planet count, topic count, completed count)

**Receives Props:**
- `systems` - List of all systems
- `activeSystemId` - Current system
- `onSystemChange` - Callback to switch systems
- `onAddBody` - Callback to create new body
- `currentPage` - Current page view
- `onPageChange` - Callback to switch pages

### 4. SidePanel.js - Edit Interface

**Features:**
- Displays moon/topic details
- Textarea for notes (overview)
- Checkbox to toggle completion
- Save button to persist changes
- Delete button with confirmation
- Metadata display (type, id, parent)

**State:**
```javascript
overview    // Text content from textarea
isCompleted // Boolean for completion status
```

**Lifecycle:**
1. Receives body prop
2. Syncs local state with body data
3. User edits fields
4. Click Save triggers onUpdate callback
5. Panel closes on delete

### 5. Tracker.js - Progress Analytics

**Displays:**
- **Statistics**: Total topics, completed topics, percentage
- **Progress Bar**: Visual representation of completion %
- **Tree View**: Hierarchical visualization

**Tree Structure:**
```
☀️ Sun Name
  🪐 Planet Name
    ☑️ Moon Name (clickable checkbox)
    ☑️ Moon Name (with notes if available)
    ...
  🪐 Planet Name
    ...
```

**Calculations:**
```javascript
totalTopics = bodies.filter(b => b.type === 'moon').length
completedTopics = moons.filter(b => b.isCompleted).length
percentage = (completedTopics / totalTopics) * 100
```

### 6. Journal.js - Task List View

**Features:**
- List view of all topics/tasks
- Add new task input
- Checkbox to toggle completion
- Remove button for each task
- Overall progress percentage
- Progress bar visualization

**Components:**
- Input field for new tasks
- Task items with: checkbox, name, overview, delete button
- Progress section with percentage and bar

## Styling Strategy

All styles in `App.css` using:

**Color Variables:**
```css
Background:     #0a0e27 (dark blue)
Primary:        #00d4ff (cyan)
Success:        #7FFF00 (lime)
Secondary:      #FF1493 (hot pink)
Sun:            #FFD700 (gold)
```

**Effects:**
- Radial gradients for glow effects
- Smooth transitions (0.3s)
- Box shadows for depth
- Text shadows for glow text
- Linear gradients for buttons

**Responsive Design:**
- Sidebar: 250px fixed width
- Main content: Flex grow to fill
- Side panel: 350px fixed right edge
- Canvas: Responsive to window size

## Key Algorithms

### 1. Orbital Motion
```javascript
// Each frame:
angle += speed * 0.01
x = parentX + cos(angle) * orbitRadius
y = parentY + sin(angle) * orbitRadius
```

### 2. Camera Lerp (Linear Interpolation)
```javascript
// 10% movement toward target each frame
current += (target - current) * 0.1
// Smooth acceleration/deceleration effect
```

### 3. Click Detection
```javascript
// For each body:
distance = sqrt((mouseX - bodyX)² + (mouseY - bodyY)²)
if (distance < bodyRadius + clickPadding) {
  select(body)
}
```

### 4. Depth Sorting
```javascript
// Sort by distance from center for proper rendering order
bodies.sort((a, b) => {
  return distance(a) - distance(b)
})
```

## Performance Optimizations

1. **Canvas Ref**: Direct DOM access, skip React reconciliation
2. **useRef for angles**: Avoid re-renders for animation state
3. **useCallback**: Prevent unnecessary function recreations
4. **Depth sorting**: Only sort once per frame, not per render
5. **Star generation**: Generate once, reuse each frame
6. **Animation separate**: requestAnimationFrame independent of React updates

## State Management Pattern

**Immutable Updates:**
```javascript
setSystems(prev => prev.map(system => {
  if (system.id !== activeSystemId) return system
  return {
    ...system,
    bodies: system.bodies.map(body =>
      body.id === targetId ? { ...body, ...updates } : body
    )
  }
}))
```

## Event Handling

**Canvas Events:**
- `onWheel` - Zoom
- `onMouseDown` - Start drag
- `onMouseMove` - Pan during drag
- `onMouseUp` - End drag
- `onClick` - Body selection

**Component Events:**
- Button clicks - Navigation & creation
- Checkbox changes - Completion toggle
- Textarea input - Note editing

## Future Implementation Guide

### Add Focus Mode Animation
1. Modify `OrbitCanvas.js` to detect focus state
2. When planet focused, calculate moon positions in vertical column
3. Lerp between orbit and column layouts over time
4. Draw moons in list-like alignment when focused

### Add Custom Colors
1. Add color picker to SidePanel
2. Store `color` in body state
3. Pass to canvas rendering functions
4. Update gradient calculations

### Add Drag Rearrangement
1. Track mouse-down on body
2. Update body position while dragging
3. Release to snap to new orbit
4. Update parent reference if dropped on different body

### Add Persistence
1. Implement localStorage saving
2. JSON.stringify systems on change
3. Load on component mount
4. Add export/import buttons

## Common Modifications

### Change animation speed
In `OrbitCanvas.js`:
```javascript
anglesRef.current[body.id] += body.speed * 0.01  // Adjust multiplier
```

### Change zoom limits
In `OrbitCanvas.js`:
```javascript
const newZoom = Math.max(0.5, Math.min(5, zoom + delta))  // Adjust min/max
```

### Change colors
In `App.js` initial state or `App.css`

### Adjust glow effect
In `OrbitCanvas.js`:
```javascript
const glowRadius = size + (isSelected ? 15 : 8)  // Adjust these values
```

## Testing Checklist

- [ ] Sun renders in center
- [ ] Planets orbit around sun
- [ ] Moons orbit around planets
- [ ] Click body to select/focus
- [ ] Scroll to zoom
- [ ] Drag to pan
- [ ] Side panel opens on moon click
- [ ] Notes save correctly
- [ ] Mark complete toggles checkbox
- [ ] Delete removes body
- [ ] Tracker shows correct stats
- [ ] Journal lists all moons
- [ ] Page navigation works
- [ ] System tabs switch correctly

---

**This architecture enables easy feature additions while maintaining performance and clean code structure.** 🚀
