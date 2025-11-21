import CodeMirrorBlock from "./CodeMirrorBlock";

export default function AttachementContentEdit({
  onChange,
  value
}: any) {
  return (
    <div>
      <CodeMirrorBlock
        editable={true}
        onChange={(value) => {
          onChange && onChange(value);
        }}
      >
        {value}
      </CodeMirrorBlock>
    </div>
  )
}
