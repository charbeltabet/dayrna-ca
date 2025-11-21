import CodeMirror from '@uiw/react-codemirror';
import { githubDark } from "@uiw/codemirror-theme-github";
import { markdown } from "@codemirror/lang-markdown"

interface CodeBlockProps {
  children: React.ReactNode;
  editable?: boolean;
  width?: string;
  height?: string;
  onChange?: (value: string) => void;
}

export default function CodeMirrorBlock({ children, editable = true, width, onChange }: CodeBlockProps) {
  const languageExtension = markdown();

  const childrenAsString = String(children).trim() || ''

  return (
    <CodeMirror
      value={childrenAsString}
      extensions={[languageExtension]}
      theme={githubDark}
      basicSetup={{
        lineNumbers: true,
      }}
      onChange={onChange}
      indentWithTab={true}
      readOnly={false}
      editable={editable}
      style={{
        width: width ? width : undefined,
      }}
    />
  );
}
