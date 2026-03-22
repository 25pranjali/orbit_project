# Environment Setup Instructions

## Prerequisites

- Windows 10/11
- Node.js 14+ (download from https://nodejs.org/)
- npm (comes with Node.js)
- VS Code (optional but recommended)

## Installation Steps

### 1. Install Node.js
- Download from https://nodejs.org/
- Choose LTS version
- Run installer and follow defaults
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

### 2. Navigate to Project Directory
```bash
cd c:\Users\admin\Desktop\Flutter_react
```

### 3. Install Dependencies
```bash
npm install
```

This will:
- Download React and dependencies
- Create node_modules folder
- Generate package-lock.json

### 4. Start Development Server
```bash
npm start
```

This will:
- Start local server at http://localhost:3000
- Open browser automatically
- Enable hot reloading (changes auto-refresh)

### 5. Building for Production
```bash
npm run build
```

This creates optimized `build/` folder ready for deployment.

## Project Scripts

```bash
npm start        # Start development server
npm run build    # Create production build
npm test         # Run tests (if added)
npm run eject    # Eject from create-react-app (irreversible!)
```

## File Locations

```
C:\Users\admin\Desktop\Flutter_react\
├── node_modules\              # Dependencies (auto-generated)
├── public\
│   └── index.html            # Main HTML file
├── src\
│   ├── App.js                # Main component
│   ├── components\           # React components
│   └── ...
├── package.json              # Project config
└── README.md                 # Documentation
```

## Troubleshooting

### Node not found
- Make sure Node.js is installed
- Restart terminal/PowerShell after installation
- Verify: `node --version`

### Port 3000 in use
- Press `Y` when prompted to use different port
- Or manually kill the process:
  ```bash
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```

### Module not found errors
```bash
rm -r node_modules
npm install
```

### Clear npm cache
```bash
npm cache clean --force
npm install
```

## VS Code Extensions (Optional)

- **ES7+ React/Redux/React-Native snippets** - dsznajder.es7-react-js-snippets
- **Prettier** - esbenp.prettier-vscode
- **ESLint** - dbaeumer.vscode-eslint

Install with:
```bash
code --install-extension <extension-id>
```

## Performance Tips

- Use npm instead of yarn if having issues
- Close other applications using port 3000
- Increase Node memory if needed:
  ```bash
  set NODE_OPTIONS=--max_old_space_size=4096
  npm start
  ```

## Getting Help

- Check README.md for feature documentation
- Review component comments in source files
- Check browser console for error messages
- Verify all dependencies installed: `npm ls`

---

**All set! Run `npm start` to begin.** 🚀
