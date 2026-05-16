import os
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Directories to STRICTLY ignore during scanning - these will never be traversed
STRICTLY_IGNORED_DIRS = {
    'node_modules',
    'venv',
    '.venv',
    '.git',
    '__pycache__'
}

# Additional directories to ignore
IGNORED_DIRS = {
    '.next',
    'env',
    '.pytest_cache',
    '.mypy_cache',
    'dist',
    'build',
    '.egg-info',
    'bob_sessions',
    '__pycache__',
    '.tox',
    'htmlcov',
    'coverage',
    '.coverage'
}

# File patterns to ignore
IGNORED_FILES = {
    '.DS_Store',
    'Thumbs.db',
    '.gitignore',
    '.env',
    '.pyc'
}


def scan_directory(path, root_path=None):
    """
    Recursively scan a directory and return a hierarchical tree structure.
    
    Args:
        path: The directory path to scan
        root_path: The root path for calculating relative paths
        
    Returns:
        A dictionary representing the directory tree with structure:
        {
            "name": str,
            "type": "file" | "directory",
            "path": str (relative path),
            "children": [] (only for directories)
        }
    """
    if root_path is None:
        root_path = path
    
    try:
        name = os.path.basename(path)
        relative_path = os.path.relpath(path, root_path)
        
        # Check if it's a file
        if os.path.isfile(path):
            return {
                "name": name,
                "type": "file",
                "path": relative_path
            }
        
        # It's a directory
        children = []
        
        try:
            entries = sorted(os.listdir(path))
        except PermissionError:
            # Skip directories we don't have permission to read
            return None
        
        for entry in entries:
            # STRICTLY skip these directories - never traverse them
            if entry in STRICTLY_IGNORED_DIRS:
                continue
            
            # Skip other ignored directories and files
            if entry in IGNORED_DIRS or entry in IGNORED_FILES:
                continue
            
            # Skip hidden files (starting with .)
            if entry.startswith('.') and entry not in {'.gitignore'}:
                continue
            
            entry_path = os.path.join(path, entry)
            
            # Double-check: if it's a directory in the strictly ignored list, skip it
            if os.path.isdir(entry_path) and entry in STRICTLY_IGNORED_DIRS:
                continue
            
            # Recursively scan subdirectories and files
            child = scan_directory(entry_path, root_path)
            if child is not None:
                children.append(child)
        
        return {
            "name": name,
            "type": "directory",
            "path": relative_path,
            "children": children
        }
    
    except Exception as e:
        print(f"Error scanning {path}: {str(e)}")
        return None


@app.route('/api/files', methods=['GET'])
def get_files():
    """
    API endpoint to get the hierarchical file structure.
    Scans from the project root directory (parent of backend/).
    """
    try:
        # Get the project root (parent directory of backend/)
        backend_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.dirname(backend_dir)
        
        # Scan the directory
        file_tree = scan_directory(project_root)
        
        if file_tree is None:
            return jsonify({
                "error": "Failed to scan directory"
            }), 500
        
        return jsonify(file_tree)
    
    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "Architecture Visualizer API is running"
    })


if __name__ == '__main__':
    print("Starting Architecture Visualizer Backend...")
    print("API available at: http://localhost:5000")
    print("Endpoints:")
    print("  - GET /api/files - Get file structure")
    print("  - GET /api/health - Health check")
    app.run(debug=True, host='0.0.0.0', port=5000)

# Made with Bob
