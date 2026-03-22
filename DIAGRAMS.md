# Visual Architecture & Diagrams

## 🎯 Application Flow

```
┌─────────────────────────────────────────────────────────┐
│                     USER INTERACTION                     │
└─────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┬───────────────────┐
        ↓                   ↓                   ↓
    Canvas Input        Button Clicks       Navigation
    - Wheel zoom        - Add planet        - Page change
    - Drag pan          - Add moon          - System switch
    - Click body        - Save/Delete       - Focus body

        ↓                   ↓                   ↓
┌─────────────────────────────────────────────────────────┐
│                   EVENT HANDLERS                         │
│                    (App.js & Sidebar)                   │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              STATE MANAGEMENT (App.js)                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │ systems[]        - All solar systems             │  │
│  │ activeSystemId   - Current system               │  │
│  │ selectedBodyId   - Selected body                │  │
│  │ focusedBodyId    - Focused body                 │  │
│  │ cameraPos        - Camera position              │  │
│  │ zoom             - Camera zoom level            │  │
│  │ currentPage      - Active page                  │  │
│  │ sidePanel        - Panel visibility             │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓
    ┌───────────┬───────────┼───────────┬────────────┐
    ↓           ↓           ↓           ↓            ↓
┌────────┐ ┌────────┐ ┌──────────┐ ┌────────┐ ┌──────────┐
│Sidebar │ │Orbit   │ │Side      │ │Tracker │ │Journal   │
│        │ │Canvas  │ │Panel     │ │        │ │          │
│- Tabs  │ │- Draw  │ │- Edit    │ │- Stats │ │- Tasks   │
│- Btns  │ │- Anim  │ │- Save    │ │- Tree  │ │- Mgmt    │
│- Nav   │ │- Click │ │- Delete  │ │- Bar   │ │- Progress│
└────────┘ └────────┘ └──────────┘ └────────┘ └──────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  UI RENDERING & DISPLAY                 │
└─────────────────────────────────────────────────────────┘
```

---

## 🌍 Solar System Data Structure

```
SYSTEM
├── ID: "system-1"
├── NAME: "React Learning Path"
└── BODIES:
    ├── SUN (Core)
    │   ├── ID: "sun-1"
    │   ├── text: "React Learning Path"
    │   ├── type: "sun"
    │   ├── position: {x: 0, y: 0}
    │   ├── color: "#FFD700" (Gold)
    │   └── children: [PLANETS]
    │
    ├── PLANET 1
    │   ├── ID: "planet-1"
    │   ├── text: "Fundamentals"
    │   ├── type: "planet"
    │   ├── parent: "sun-1"
    │   ├── orbitRadius: 120
    │   ├── angle: 0 (rotates)
    │   ├── speed: 0.8
    │   ├── color: "#00D4FF" (Cyan)
    │   └── children: [MOONS 1, 2]
    │       ├── MOON 1
    │       │   ├── ID: "moon-1"
    │       │   ├── text: "Components"
    │       │   ├── type: "moon"
    │       │   ├── parent: "planet-1"
    │       │   ├── orbitRadius: 60
    │       │   ├── speed: 1.5
    │       │   ├── color: "#7FFF00" (Lime)
    │       │   ├── isCompleted: false
    │       │   └── overview: "..."
    │       │
    │       └── MOON 2
    │           ├── ID: "moon-2"
    │           ├── text: "Hooks"
    │           ├── isCompleted: true
    │           └── ...
    │
    └── PLANET 2
        ├── ID: "planet-2"
        ├── text: "Advanced"
        ├── ...
        └── children: [MOONS]
```

---

## 🎬 Canvas Rendering Pipeline

```
FRAME START (via requestAnimationFrame)
           ↓
[1] UPDATE ANGLES
    ├── angle += speed * 0.01  (for each body)
    └── Continuous rotation

           ↓
[2] UPDATE CAMERA (Smooth Lerp)
    ├── currentX += (targetX - currentX) * 0.1
    ├── currentY += (targetY - currentY) * 0.1
    └── currentZoom += (targetZoom - currentZoom) * 0.1

           ↓
[3] CLEAR CANVAS
    └── ctx.fillRect(0, 0, width, height) with background

           ↓
[4] DRAW BACKGROUND
    ├── Stars at fixed positions
    └── Nebula gradients

           ↓
[5] DRAW ORBITS
    └── For each body with parent:
        ├── Calculate parent position
        └── Draw circle path

           ↓
[6] CALCULATE POSITIONS
    ├── For each body:
    │   ├── Get parent position
    │   ├── angle = stored angle
    │   ├── x = parentX + cos(angle) * orbitRadius
    │   └── y = parentY + sin(angle) * orbitRadius
    └── Sort by distance (depth)

           ↓
[7] DRAW BODIES
    ├── For each body (sorted):
    │   ├── Convert world → screen space
    │   ├── Draw glow effect
    │   ├── Draw body circle
    │   ├── Draw border if selected
    │   └── Draw completion indicator

           ↓
[8] DRAW LABELS
    └── For planets & suns:
        └── Draw text below body

           ↓
[9] NEXT FRAME
    └── requestAnimationFrame(animate)
```

---

## 🖱️ Interaction Pipeline

```
USER ACTION
    ↓
EVENT TRIGGERED
    ├── onWheel          (canvas zoom)
    ├── onMouseDown      (drag start)
    ├── onMouseMove      (pan/drag)
    ├── onMouseUp        (drag end)
    └── onClick          (body select)
    
    ↓
HANDLER FUNCTION
    ├── Calculate world space positions
    ├── Determine affected objects
    └── Call callback

    ↓
APP.JS CALLBACK
    ├── Update state
    │   ├── selectedBodyId
    │   ├── cameraPos
    │   ├── zoom
    │   └── sidePanel
    └── setState() triggered

    ↓
REACT RE-RENDER
    ├── Props updated to children
    └── Canvas/UI refreshes

    ↓
NEXT FRAME
    └── Animation continues with new state
```

---

## 📍 Camera System Math

```
┌────────────────────────────────────────┐
│  WORLD SPACE (Infinite)                │
│                                        │
│      Sun (0, 0)                       │
│      ↙   ↘                            │
│   Planet  Planet                       │
│   ↙↘      ↙↘                          │
│  M  M    M  M                         │
│                                        │
└────────────────────────────────────────┘
         ↓
    APPLY CAMERA
    ├── Translate: (worldX + cameraX, worldY + cameraY)
    ├── Scale: * zoom level
    └── Center: + (canvasWidth/2, canvasHeight/2)
         ↓
┌────────────────────────────────────────┐
│  SCREEN SPACE (Canvas)                 │
│  0,0 ──────────────► x                │
│   │                                   │
│   │                                   │
│   ↓ y                                 │
│                                        │
│    [Canvas Content Visible]            │
│                                        │
│  Width: canvasWidth                   │
│  Height: canvasHeight                 │
└────────────────────────────────────────┘

FORMULA:
screenX = (worldX + cameraX) * zoom + (canvasWidth / 2)
screenY = (worldY + cameraY) * zoom + (canvasHeight / 2)

INVERSE (Click Detection):
worldX = (screenX - canvasWidth / 2) / zoom - cameraX
worldY = (screenY - canvasHeight / 2) / zoom - cameraY
```

---

## 🎯 Click Detection Algorithm

```
CLICK EVENT
    ↓
GET CANVAS COORDINATES
    └── rect = canvas.getBoundingClientRect()
        clickX = mouseX - rect.left
        clickY = mouseY - rect.top

    ↓
FOR EACH BODY
    ├── Get screen position (from drawing)
    │   └── screenX, screenY, size
    │
    ├── Calculate distance
    │   └── distance = √((clickX - screenX)² + (clickY - screenY)²)
    │
    └── Check if within radius
        └── if (distance ≤ size + 10)
            └── POTENTIAL HIT

    ↓
SELECT CLOSEST BODY
    ├── Find body with minimum distance
    ├── Ensure distance < maxDistance (20px threshold)
    └── Return closest body

    ↓
CALLBACK
    ├── if (body found)
    │   └── onBodySelect(body.id)
    └── else
        └── onBodySelect(null) [Reset view]
```

---

## 🔄 State Update Pattern

```
EVENT OCCURS
    ↓
EVENT HANDLER CALLS UPDATE CALLBACK
    └── updateBody(bodyId, { field: newValue })

    ↓
APP.JS UPDATE FUNCTION
    │
    └── setSystems(prev => 
        prev.map(system => {
            if (system.id !== activeSystemId) 
                return system
            
            return {
                ...system,
                bodies: system.bodies.map(body =>
                    body.id === bodyId 
                        ? { ...body, ...updates }
                        : body
                )
            }
        })
    )

    ↓
STATE UPDATED
    └── Triggers re-render

    ↓
PROPS FLOW DOWN
    ├── OrbitCanvas: Gets updated bodies
    ├── SidePanel: Gets updated body
    └── Tracker: Gets updated bodies

    ↓
NEXT ANIMATION FRAME
    └── Canvas renders with new data
```

---

## 📊 Component Hierarchy

```
App (Root)
├── State Management
│   ├── systems
│   ├── activeSystemId
│   ├── selectedBodyId
│   ├── focusedBodyId
│   ├── cameraPos
│   ├── zoom
│   ├── currentPage
│   └── sidePanel
│
├── Sidebar Component
│   ├── System Tabs
│   ├── Button Group (Add Planet/Topic)
│   ├── Page Navigation
│   └── System Info Display
│
├── Main Content Container
│   │
│   ├── IF page === "orbit"
│   │   └── OrbitCanvas
│   │       ├── Canvas Element
│   │       ├── Animation Loop
│   │       ├── Event Handlers
│   │       └── Drawing Functions
│   │
│   ├── IF page === "tracker"
│   │   └── Tracker
│   │       ├── Header
│   │       ├── Statistics Box
│   │       ├── Progress Bar
│   │       └── Tree View
│   │
│   └── IF page === "journal"
│       └── Journal
│           ├── Header
│           ├── Add Task Form
│           ├── Task List
│           └── Progress Section
│
└── SidePanel Component
    ├── Close Button
    ├── Title
    ├── Notes Textarea
    ├── Completion Checkbox
    ├── Save/Delete Buttons
    └── Metadata Display
```

---

## ⚙️ Animation Loop Detailed

```
requestAnimationFrame(animate)
        ↓
    [FRAME N]
        ↓
    FOR EACH BODY:
    ├── Update rotation angle
    │   └── anglesRef.current[id] += speed * 0.01
    │
    └── Calculate new position
        ├── Get parent position (recursive)
        └── Apply angle rotation formula

    ↓
    LERP CAMERA (Smooth movement)
    ├── currentX += (targetX - currentX) * 0.1
    ├── currentY += (targetY - currentY) * 0.1
    └── currentZoom += (targetZoom - currentZoom) * 0.1

    ↓
    CLEAR CANVAS
    └── Fill with background color

    ↓
    RENDER PIPELINE
    ├── 1. Draw stars
    ├── 2. Draw orbits
    ├── 3. Depth-sort bodies
    ├── 4. Draw bodies with glow
    └── 5. Draw labels

    ↓
    REQUEST NEXT FRAME
    └── requestAnimationFrame(animate) ← Loop back

    ↓
    FREQUENCY: ~60 FPS (16.67ms per frame)
```

---

## 🎨 Color Scheme Reference

```
PRIMARY COLORS
├── Background:      #0a0e27  (Deep Space Blue)
├── Primary Accent:  #00d4ff  (Cyan/Electric)
├── Success:         #7FFF00  (Lime Green)
├── Secondary:       #FF1493  (Hot Pink)
└── Highlight:       #FFD700  (Gold)

COMPONENT USAGE
├── Sun:     #FFD700 (Gold)
├── Planets: #FF1493 (Hot Pink) or #00D4FF (Cyan)
├── Moons:   #7FFF00 (Lime) or varied colors
└── Buttons: Gradient from Primary → Secondary

EFFECTS
├── Glow:    rgba(0, 212, 255, 0.3)
├── Shadow:  rgba(0, 0, 0, 0.5)
├── Glow Text: text-shadow: 0 0 10px #00d4ff
└── Gradient Buttons: linear-gradient(135deg, color1, color2)
```

---

## 🔀 Focus Mode Transition

```
NORMAL STATE
├── Camera centered at (0, 0)
├── Bodies in full orbit
└── All moons visible around parents

    ↓ USER CLICKS PLANET

FOCUS TRANSITION
├── Calculate planet position
├── Set target camera to planet position
├── Set target zoom to 2.0x
├── Lerp animation begins

    ↓ EACH FRAME

LERP PROGRESS
├── currentCameraX += (targetX - currentX) * 0.1
├── currentCameraY += (targetY - currentY) * 0.1
├── currentZoom += (targetZoom - currentZoom) * 0.1
└── Visual easing effect

    ↓ COMPLETED

FOCUSED STATE
├── Camera centered on planet
├── Zoom level = 2.0x
├── Planet & moons prominent
└── Other planets small in background
```

---

## 📈 State Flow Example

```
INITIAL STATE
├── bodies = [sun-1, planet-1, planet-2, moon-1, moon-2, ...]
├── selectedBodyId = null
├── cameraPos = {x: 0, y: 0}
├── zoom = 1
└── sidePanel = {visible: false}

        ↓ USER CLICKS MOON-1

EVENT TRIGGERED
└── handleBodySelect("moon-1")

        ↓ APP.JS HANDLER

STATE UPDATED
├── selectedBodyId = "moon-1"
├── cameraPos = {x: -180, y: 0}  (auto center)
├── zoom = 2  (auto zoom)
└── sidePanel = {visible: true, bodyId: "moon-1"}

        ↓ REACT RE-RENDER

COMPONENT UPDATES
├── SidePanel shows moon-1 details
├── OrbitCanvas draws with glow on moon-1
├── Camera centers on moon-1

        ↓ USER EDITS NOTES

EVENT TRIGGERED
└── onUpdate("moon-1", {overview: "new notes"})

        ↓ APP.JS HANDLER

STATE UPDATED
└── bodies[moon-1].overview = "new notes"

        ↓ REACT RE-RENDER

UI UPDATES
└── SidePanel textarea shows new content
```

---

## 🚀 Performance Optimization Techniques

```
RENDER OPTIMIZATION
├── useCallback
│   └── Memoize functions to prevent unnecessary recreations
│
├── useRef
│   ├── Store canvas reference
│   ├── Store animation angles
│   └── Store camera targets
│   └── Avoid state updates for animation values
│
└── Avoid unnecessary re-renders
    └── Separate animation state from React state

ANIMATION OPTIMIZATION
├── requestAnimationFrame
│   └── Synchronize with browser refresh rate
│
├── Canvas rendering
│   └── Single canvas draw per frame
│   └── No virtual DOM overhead
│
└── Depth sorting
    └── Calculated once per frame
    └── Not on every render

ALGORITHM OPTIMIZATION
├── Distance calculations
│   └── Cached in objects for reuse
│
├── Position calculations
│   └── Recursive parent lookup
│   └── Cached when possible
│
└── Event handlers
    └── Throttled/debounced where needed
```

---

## 📐 Orbital Motion Formula

```
FOR EACH BODY (Not a Sun):
    
1. GET PARENT POSITION
   parentPos = calculatePosition(parentBody)

2. UPDATE ANGLE (Rotation)
   angle += speed * deltaTime
   angle %= (2 * π)  // Keep in 0-360 range

3. CALCULATE NEW POSITION
   x = parentPos.x + cos(angle) * orbitRadius
   y = parentPos.y + sin(angle) * orbitRadius

4. RECURSIVE CALCULATION
   └── This works for moons (whose parent is a planet whose parent is a sun)

TRIGONOMETRY
├── x = cos(angle) * radius  → Horizontal distance
├── y = sin(angle) * radius  → Vertical distance
├── angle 0°    → (radius, 0)      [right]
├── angle 90°   → (0, radius)      [down]
├── angle 180°  → (-radius, 0)     [left]
└── angle 270°  → (0, -radius)     [up]

RESULT: Smooth circular orbit motion
```

---

This documentation provides complete visual understanding of the system! 🎨✨
