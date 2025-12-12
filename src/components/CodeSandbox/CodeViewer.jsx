import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeViewer = ({ file, content }) => {
  if (!file) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-lg mb-2">No file selected</p>
          <p className="text-sm">
            Select a file from the tree to view its contents
          </p>
        </div>
      </div>
    );
  }

  const getLanguage = (filename) => {
    const ext = filename.split(".").pop();
    const langMap = {
      js: "javascript",
      jsx: "jsx",
      ts: "typescript",
      tsx: "tsx",
      py: "python",
      java: "java",
      json: "json",
      html: "html",
      css: "css",
      md: "markdown",
    };
    return langMap[ext] || "text";
  };

  return (
    <div className="h-full overflow-auto">
      <div className="sticky top-0 z-10 px-4 py-3 bg-surface border-b border-white/10 flex items-center justify-between">
        <span className="text-sm text-gray-400">{file.path}</span>
        <span className="text-xs text-gray-500 uppercase">
          {getLanguage(file.name)}
        </span>
      </div>
      <SyntaxHighlighter
        language={getLanguage(file.name)}
        style={vscDarkPlus}
        showLineNumbers
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "transparent",
          fontSize: "14px",
        }}
      >
        {content || "// Empty file"}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeViewer;
