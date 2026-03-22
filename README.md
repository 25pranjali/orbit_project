# Orbit Task Manager - React Solar System Task Management

A visually stunning task management application that represents your learning path as an interactive solar system. Planets orbit a sun, and moons orbit planets, creating a dynamic, animated interface for organizing topics and subtopics.

## 🚀 Features

### Core Functionality
- **Orbit System**: Animated planets and moons orbiting in real-time using Canvas and requestAnimationFrame
- **Interactive Click Detection**: Click on celestial bodies to select, focus, and manage them
- **Camera System**: 
  - Zoom in/out with mouse wheel
  - Pan by dragging
  - Smooth camera interpolation (lerp)
  - Auto-focus on selected bodies
- **Dark Space Theme**: Beautiful futuristic UI with glow effects and nebula styling
- **Multi-System Support**: Create and switch between multiple task systems

### Pages

#### 🌍 Orbit View
- Real-time animated solar system visualization
- Click sun/planet to focus and zoom in
- Click moon to open side panel with details
- Orbit paths drawn for reference
- Glow effects for selected/completed items
- Starfield background

#### 📊 Progress Tracker
- Statistics: Total topics, completed topics, percentage
- Hierarchical tree view: Sun → Planets → Moons
- Visual progress bar
- Toggle completion directly from tree

#### 📝 Journal
- Task list view of all topics
- Add/remove tasks
- Mark complete/incomplete
- Overall progress percentage
- Notes for each topic

### UI Components

#### Sidebar
- System navigation (tabs for multiple systems)
- Quick controls to add planets and topics
- Page navigation
- System information display

#### Side Panel
- Opens when clicking a moon/topic
- Edit notes and overview
- Toggle completion status
- Save and delete options
- Body metadata display

## 🛠️ Tech Stack

- **React 18** - Functional components with hooks
- **HTML5 Canvas** - Rendering and animation
- **requestAnimationFrame** - Smooth 60 FPS animation
- **CSS3** - Futuristic styling and gradients
- **Pure JavaScript** - No external UI libraries

## 📦 Project Structure

```
src/
├── App.js                 # Main application component
├── App.css               # Global styles
├── index.js              # React entry point
├── index.css             # Base styles
└── components/
    ├── OrbitCanvas.js    # Canvas rendering & animation
    ├── Sidebar.js        # Navigation & controls
    ├── SidePanel.js      # Details panel for topics
    ├── Tracker.js        # Progress tracking page
    └── Journal.js        # Task management page
```

## 🎮 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Navigate to project directory**
   ```bash
   cd Flutter_react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   - Application will automatically open at `http://localhost:3000`
   - Allow fullscreen canvas rendering

### Build for Production
```bash
npm run build
```

## 🎯 Usage Guide

### Getting Started

1. **View the Orbit**
   - You'll start in the Orbit View with a default system
   - Observe planets orbiting the sun "React Learning Path"
   - Notice moons orbiting planets with smooth animation

2. **Interact with Bodies**
   - **Scroll to Zoom**: Use mouse wheel to zoom in/out
   - **Drag to Pan**: Click and drag to move the view around
   - **Click Bodies**: 
     - Click a sun or planet to focus and zoom in
     - Click a moon to open the side panel
     - Click empty space to reset view

3. **Manage Topics**
   - Click a moon to open the side panel
   - Edit notes in the textarea
   - Toggle "Mark Complete" checkbox
   - Click Save to update
   - Click Delete to remove

4. **Add New Content**
   - Use sidebar buttons: "Add Planet" and "Add Topic"
   - New planets orbit the sun
   - New topics are added as moons to the selected planet

5. **Track Progress**
   - Go to "Tracker" page to see statistics
   - View hierarchical tree of your system
   - Check completion percentage
   - Click checkboxes in tree to toggle completion

6. **Manage Journal**
   - Go to "Journal" page for task list view
   - See all topics in list format
   - Track overall progress percentage
   - Complete/incomplete tasks from this view

## 🎨 Visual Design

### Color Scheme
- **Background**: Deep space blue (`#0a0e27`)
- **Primary Accent**: Cyan (`#00d4ff`)
- **Positive/Completed**: Lime green (`#7FFF00`)
- **Secondary Accent**: Hot pink (`#FF1493`)
- **Gold**: Sun color (`#FFD700`)

### Effects
- **Glow**: Radial gradients around bodies
- **Stars**: Random starfield in background
- **Smooth Transitions**: Lerp-based camera movement
- **Completion Glow**: Enhanced glow for completed items

## 🔧 Key Technical Features

### Animation Loop
- Uses `requestAnimationFrame` for 60 FPS smooth animation
- Efficient canvas rendering with depth sorting
- Dynamic angle calculations for orbital motion

### Camera System
- Linear interpolation (lerp) for smooth camera movement
- Supports zoom levels from 0.5x to 5x
- Pan with mouse drag
- Auto-focus with position tracking

### Click Detection
- Screen space to world space conversion
- Distance-based body selection
- Prevents selection during drag

### Performance Optimizations
- Canvas ref for direct DOM access
- Avoided unnecessary re-renders
- Animation loop separated from React state updates
- Star field generated once and reused

## 📊 Data Structure

Each body has:
```javascript
{
  id: string,                    // Unique identifier
  text: string,                  // Display name
  type: 'sun' | 'planet' | 'moon',
  parent: string | null,         // Parent body ID
  orbitRadius: number,           // Distance from parent
  angle: number,                 // Current angle in orbit
  speed: number,                 // Rotation speed
  position: { x: number, y: number },
  color: string,                 // Hex color code
  isCompleted: boolean,
  overview: string               // Notes/description
}
```

## 🚀 Future Enhancements

- [ ] Focus mode with moons in vertical column layout
- [ ] Multiple system creation UI
- [ ] Drag to rearrange bodies
- [ ] Custom colors for bodies
- [ ] Export/import systems
- [ ] Reminder notifications
- [ ] Touch device support
- [ ] Dark/light theme toggle

## 🎓 Learning Resources

This project demonstrates:
- React hooks (useState, useEffect, useCallback, useRef, useContext)
- Canvas API and animation techniques
- Performance optimization patterns
- Event handling and interaction detection
- Component composition and state management
- CSS animations and gradients

## 📝 License

Open source project - feel free to use and modify!

## 🤝 Contributing

Feel free to fork, improve, and submit pull requests!

---

**Built with ❤️ for learners and task enthusiasts** 🚀✨
