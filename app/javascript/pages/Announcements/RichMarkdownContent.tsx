import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

export default function RichMarkdownContent({ children }: any) {
  // Pre-process content to preserve multiple empty lines
  // Replace sequences of 2+ newlines with explicit line breaks
  const processedContent = typeof children === 'string'
    ? children.replace(/\n\n+/g, (match) => {
      // For each pair of newlines, create a paragraph with a non-breaking space
      const lineCount = match.length;
      const extraLines = Math.floor(lineCount / 2) - 1;
      return '\n\n' + '&nbsp;\n\n'.repeat(extraLines);
    })
    : children;

  return (
    <div className="daisy-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          p: ({ children }) => {
            // Preserve empty paragraphs and non-breaking spaces
            if (!children || (typeof children === 'string' && children.trim() === '')) {
              return <p className="min-h-[1em]">&nbsp;</p>;
            }
            // Check if paragraph contains only &nbsp;
            if (children === '&nbsp;') {
              return <p className="min-h-[1em]">&nbsp;</p>;
            }
            return <p>{children}</p>;
          }
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}