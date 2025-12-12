import React from "react";
import { motion } from "framer-motion";
import {
  File,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  FileCode,
  FileJson,
  FileText,
} from "lucide-react";

const getFileIcon = (filename) => {
  const ext = filename.split(".").pop();
  switch (ext) {
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
    case "py":
    case "java":
      return FileCode;
    case "json":
      return FileJson;
    case "md":
    case "txt":
      return FileText;
    default:
      return File;
  }
};

const FileIcon = ({ item, isOpen, isSelected }) => {
  const isFolder = item.type === "folder";
  const className = `w-4 h-4 ${isSelected ? "text-accent" : "text-gray-400"}`;

  if (isFolder) {
    return isOpen ? (
      <FolderOpen className={className} />
    ) : (
      <Folder className={className} />
    );
  }

  const FileTypeIcon = getFileIcon(item.name);
  return React.createElement(FileTypeIcon, { className });
};

const FileTreeItem = ({ item, onSelect, selectedFile, depth = 0 }) => {
  const [isOpen, setIsOpen] = React.useState(depth === 0);
  const isFolder = item.type === "folder";
  const isSelected = selectedFile?.path === item.path;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-white/5 rounded-lg transition-colors ${
          isSelected ? "bg-accent/10 text-accent" : "text-gray-300"
        }`}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
        onClick={() => {
          if (isFolder) {
            setIsOpen(!isOpen);
          } else {
            onSelect(item);
          }
        }}
      >
        {isFolder && (
          <span className="text-gray-500">
            {isOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
        )}
        <FileIcon item={item} isOpen={isOpen} isSelected={isSelected} />
        <span className="text-sm truncate">{item.name}</span>
      </motion.div>

      {isFolder && isOpen && item.children && (
        <div>
          {item.children.map((child, i) => (
            <FileTreeItem
              key={i}
              item={child}
              onSelect={onSelect}
              selectedFile={selectedFile}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileTree = ({ files, onSelectFile, selectedFile }) => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-white/10">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          Files
        </h3>
      </div>
      <div className="p-2">
        {files.map((file, i) => (
          <FileTreeItem
            key={i}
            item={file}
            onSelect={onSelectFile}
            selectedFile={selectedFile}
          />
        ))}
      </div>
    </div>
  );
};

export default FileTree;
