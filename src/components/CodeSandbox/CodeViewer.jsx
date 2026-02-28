import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import markup from "react-syntax-highlighter/dist/esm/languages/prism/markup";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import markdown from "react-syntax-highlighter/dist/esm/languages/prism/markdown";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";

SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("html", markup);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("markdown", markdown);
SyntaxHighlighter.registerLanguage("bash", bash);

const CodeViewer = ({ code, language, showLineNumbers = true }) => {
  if (!code && code !== "") {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center p-8 bg-black/20 rounded-2xl border border-white/5 backdrop-blur-sm">
          <p className="text-lg mb-2 text-white font-semibold">Pripravený na analýzu</p>
          <p className="text-sm text-gray-400">
            Vyberte súbor z prieskumníka na zobrazenie obsahu
          </p>
        </div>
      </div>
    );
  }

  const getPrismLanguage = (lang) => {
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
    return langMap[lang] || lang || "text";
  };

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <div className="flex-1 overflow-auto custom-scrollbar">
        <SyntaxHighlighter
          language={getPrismLanguage(language)}
          style={vscDarkPlus}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: "1.5rem",
            background: "transparent",
            fontSize: "13px",
            lineHeight: "1.6",
            fontFamily: "'Fira Code', 'Monaco', monospace",
          }}
          lineNumberStyle={{
            minWidth: "3em",
            paddingRight: "1em",
            color: "#4a4a4a",
            textAlign: "right",
            userSelect: "none",
          }}
        >
          {code || "// Empty file"}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeViewer;
