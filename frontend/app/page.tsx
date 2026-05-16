"use client";

import { useState, useEffect, useMemo } from "react";

// Type definitions for the file tree structure
interface FileNode {
  name: string;
  type: "file" | "directory";
  path: string;
  children?: FileNode[];
}

// Helper function to check if a node or its children match the search query
function nodeMatchesSearch(node: FileNode, searchQuery: string): boolean {
  if (!searchQuery) return true;
  
  const query = searchQuery.toLowerCase();
  
  // Check if current node matches
  if (node.name.toLowerCase().includes(query)) {
    return true;
  }
  
  // Check if any children match (recursive)
  if (node.children) {
    return node.children.some(child => nodeMatchesSearch(child, searchQuery));
  }
  
  return false;
}

// Helper function to filter tree based on search query
function filterTree(node: FileNode, searchQuery: string): FileNode | null {
  if (!searchQuery) return node;
  
  const query = searchQuery.toLowerCase();
  
  // Check if current node matches
  const currentMatches = node.name.toLowerCase().includes(query);
  
  // Filter children recursively
  let filteredChildren: FileNode[] = [];
  if (node.children) {
    filteredChildren = node.children
      .map(child => filterTree(child, searchQuery))
      .filter((child): child is FileNode => child !== null);
  }
  
  // Include node if it matches or has matching children
  if (currentMatches || filteredChildren.length > 0) {
    return {
      ...node,
      children: filteredChildren.length > 0 ? filteredChildren : node.children
    };
  }
  
  return null;
}

// FileTree component for recursive rendering
function FileTree({
  node,
  level = 0,
  searchQuery = ""
}: {
  node: FileNode;
  level?: number;
  searchQuery?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(level < 2 || searchQuery.length > 0); // Auto-expand when searching

  const isDirectory = node.type === "directory";
  const hasChildren = node.children && node.children.length > 0;
  
  // Check if this node matches the search
  const isMatch = searchQuery && node.name.toLowerCase().includes(searchQuery.toLowerCase());

  // Auto-expand when search query changes
  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsExpanded(true);
    }
  }, [searchQuery]);

  const toggleExpand = () => {
    if (isDirectory) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
          level === 0 ? "font-semibold" : ""
        } ${isMatch ? "bg-yellow-100 dark:bg-yellow-900/30" : ""}`}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={toggleExpand}
      >
        {/* Icon */}
        <span className="text-lg flex-shrink-0">
          {isDirectory ? (
            isExpanded ? (
              <span className="text-blue-500">📂</span>
            ) : (
              <span className="text-blue-400">📁</span>
            )
          ) : (
            <span className={isMatch ? "text-yellow-600" : "text-gray-500"}>📄</span>
          )}
        </span>

        {/* Name with highlighting */}
        <span
          className={`text-sm ${
            isDirectory
              ? "text-blue-600 dark:text-blue-400 font-medium"
              : isMatch
              ? "text-yellow-800 dark:text-yellow-300 font-semibold"
              : "text-gray-700 dark:text-gray-300"
          }`}
        >
          {isMatch ? (
            <HighlightedText text={node.name} query={searchQuery} />
          ) : (
            node.name
          )}
        </span>

        {/* Directory indicator */}
        {isDirectory && hasChildren && (
          <span className="text-xs text-gray-400 ml-1">
            {isExpanded ? "▼" : "▶"}
          </span>
        )}
      </div>

      {/* Children */}
      {isDirectory && isExpanded && hasChildren && (
        <div>
          {node.children!.map((child, index) => (
            <FileTree
              key={`${child.path}-${index}`}
              node={child}
              level={level + 1}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Component to highlight matching text
function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={index} className="bg-yellow-300 dark:bg-yellow-600 px-0.5 rounded">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

// Main page component
export default function Home() {
  const [fileTree, setFileTree] = useState<FileNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch file structure from backend
    const fetchFiles = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:5000/api/files");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setFileTree(data);
      } catch (err) {
        console.error("Error fetching files:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch file structure. Make sure the backend is running on port 5000."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  // Filter the tree based on search query
  const filteredTree = useMemo(() => {
    if (!fileTree || !searchQuery) return fileTree;
    return filterTree(fileTree, searchQuery);
  }, [fileTree, searchQuery]);

  // Count matching files
  const matchCount = useMemo(() => {
    if (!searchQuery || !fileTree) return 0;
    
    const countMatches = (node: FileNode): number => {
      let count = 0;
      if (node.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        count = 1;
      }
      if (node.children) {
        count += node.children.reduce((sum, child) => sum + countMatches(child), 0);
      }
      return count;
    };
    
    return countMatches(fileTree);
  }, [fileTree, searchQuery]);

  // Function to export the file tree as JSON
  const exportToJSON = () => {
    if (!fileTree) return;

    // Create a formatted JSON string
    const jsonString = JSON.stringify(fileTree, null, 2);
    
    // Create a blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    link.download = `architecture-${timestamp}.json`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Architecture Visualizer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore your project structure in a hierarchical tree view
          </p>
        </header>

        {/* Main Content */}
        <main className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading file structure...
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h3 className="font-semibold text-red-800 dark:text-red-400 mb-1">
                    Error Loading Files
                  </h3>
                  <p className="text-red-600 dark:text-red-300 text-sm">
                    {error}
                  </p>
                  <p className="text-red-500 dark:text-red-400 text-xs mt-2">
                    Make sure the Flask backend is running:
                    <code className="block mt-1 bg-red-100 dark:bg-red-900/40 px-2 py-1 rounded">
                      cd backend && python app.py
                    </code>
                  </p>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && fileTree && (
            <div>
              {/* Search Bar and Export Button */}
              <div className="mb-6">
                <div className="flex gap-3 items-start">
                  {/* Search Input */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search files and folders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 pl-12 pr-10 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                      🔍
                    </span>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        title="Clear search"
                      >
                        <span className="text-xl">✕</span>
                      </button>
                    )}
                  </div>
                  
                  {/* Export JSON Button */}
                  <button
                    onClick={exportToJSON}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 dark:from-green-600 dark:to-emerald-700 dark:hover:from-green-700 dark:hover:to-emerald-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap"
                    title="Export file tree as JSON"
                  >
                    <span className="text-xl">💾</span>
                    <span>Export JSON</span>
                  </button>
                </div>
                
                {searchQuery && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {matchCount > 0 ? (
                      <span>
                        Found <span className="font-semibold text-blue-600 dark:text-blue-400">{matchCount}</span> matching {matchCount === 1 ? 'item' : 'items'}
                      </span>
                    ) : (
                      <span className="text-orange-600 dark:text-orange-400">
                        No matches found for "{searchQuery}"
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* File Tree */}
              <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Project Structure
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {searchQuery
                    ? "Showing filtered results - matching items are highlighted"
                    : "Click on folders to expand or collapse"
                  }
                </p>
              </div>
              <div className="font-mono text-sm overflow-x-auto">
                {filteredTree ? (
                  <FileTree node={filteredTree} searchQuery={searchQuery} />
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No matches found
                  </div>
                )}
              </div>
            </div>
          )}

          {!loading && !error && !fileTree && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No file structure available
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Backend: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">http://localhost:5000</code>
          </p>
        </footer>
      </div>
    </div>
  );
}

// Made with Bob
