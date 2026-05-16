# Architecture Visualizer

A full-stack application that visualizes your project's file structure in an interactive hierarchical tree view.

## Features

- 🌳 **Hierarchical Tree View**: Browse your project structure with expandable/collapsible folders
- 🎨 **Modern UI**: Clean, responsive design with dark mode support
- ⚡ **Real-time Scanning**: Backend scans the directory structure on demand
- 🚫 **Smart Filtering**: Automatically ignores common directories like `node_modules`, `.venv`, `.git`
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Backend
- **Flask** (Python): REST API server
- **Flask-CORS**: Cross-origin resource sharing support

### Frontend
- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling

## Project Structure

```
architecture-visualizer/
├── backend/
│   ├── app.py              # Flask API server
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── app/
│   │   ├── page.tsx       # Main React component
│   │   ├── layout.tsx     # App layout
│   │   └── globals.css    # Global styles
│   ├── package.json       # Node dependencies
│   └── next.config.ts     # Next.js configuration
└── README.md              # This file
```

## Setup Instructions

### Prerequisites

- **Python 3.8+** installed
- **Node.js 18+** and npm installed

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   # Windows
   python -m venv .venv
   .venv\Scripts\activate

   # macOS/Linux
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the Flask server:
   ```bash
   python app.py
   ```

   The backend will start on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:3000`

## Usage

1. **Start the Backend**: Make sure the Flask server is running on port 5000
2. **Start the Frontend**: Make sure the Next.js dev server is running on port 3000
3. **Open Browser**: Navigate to `http://localhost:3000`
4. **Explore**: Click on folders to expand/collapse and browse your project structure

## API Endpoints

### `GET /api/files`
Returns the hierarchical file structure of the project.

**Response Format:**
```json
{
  "name": "project-name",
  "type": "directory",
  "path": ".",
  "children": [
    {
      "name": "file.txt",
      "type": "file",
      "path": "file.txt"
    },
    {
      "name": "folder",
      "type": "directory",
      "path": "folder",
      "children": [...]
    }
  ]
}
```

### `GET /api/health`
Health check endpoint to verify the API is running.

**Response:**
```json
{
  "status": "healthy",
  "message": "Architecture Visualizer API is running"
}
```

## Configuration

### Ignored Directories

The backend automatically ignores the following directories:
- `node_modules`
- `.venv`, `venv`, `env`
- `.git`
- `__pycache__`
- `.next`
- `.pytest_cache`
- `.mypy_cache`
- `dist`, `build`
- `.egg-info`
- `bob_sessions`

To modify this list, edit the `IGNORED_DIRS` set in `backend/app.py`.

### Ignored Files

The following files are ignored:
- `.DS_Store`
- `Thumbs.db`
- `.env`

Hidden files (starting with `.`) are also ignored by default, except `.gitignore`.

## Development

### Backend Development

The Flask server runs in debug mode by default, which means:
- Auto-reload on code changes
- Detailed error messages
- Debug toolbar available

### Frontend Development

Next.js provides:
- Hot Module Replacement (HMR)
- Fast Refresh for instant feedback
- TypeScript type checking

## Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'flask'`
- **Solution**: Make sure you've activated the virtual environment and installed dependencies

**Problem**: `Address already in use`
- **Solution**: Port 5000 is already in use. Stop other services or change the port in `app.py`

### Frontend Issues

**Problem**: `Failed to fetch file structure`
- **Solution**: Ensure the backend is running on `http://localhost:5000`

**Problem**: CORS errors in browser console
- **Solution**: Verify `flask-cors` is installed and CORS is enabled in `app.py`

### Connection Issues

**Problem**: Frontend can't connect to backend
- **Solution**: 
  1. Check that backend is running: `curl http://localhost:5000/api/health`
  2. Verify no firewall is blocking port 5000
  3. Check browser console for detailed error messages

## Future Enhancements

Potential features to add:
- 📊 File statistics (size, count, types)
- 🔍 Search and filter functionality
- 📁 File content preview
- 🎨 Syntax highlighting for code files
- 💾 Export tree structure to JSON/Markdown
- 🔄 Real-time file system watching
- 📈 Visualization of file dependencies

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

If you encounter any issues or have questions:
1. Check the Troubleshooting section above
2. Review the code comments in `backend/app.py` and `frontend/app/page.tsx`
3. Open an issue with detailed information about your problem

---

Built with ❤️ using Flask and Next.js