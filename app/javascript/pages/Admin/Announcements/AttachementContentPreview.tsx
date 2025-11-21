// import MDXRenderer from "./MdxContent";
import { KitchenSinkToolbar, MDXEditor, codeBlockPlugin, codeMirrorPlugin, diffSourcePlugin, frontmatterPlugin, headingsPlugin, imagePlugin, linkDialogPlugin, linkPlugin, listsPlugin, markdownShortcutPlugin, quotePlugin, sandpackPlugin, tablePlugin, thematicBreakPlugin, toolbarPlugin } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import '../../../entrypoints/daisy-prose.css';
import CustomImageDialog from './CustomImageDialog';
import React from 'react';

function getPlugins(originalContent: string) {
  return ([
    toolbarPlugin({ toolbarContents: () => <KitchenSinkToolbar /> }),
    listsPlugin(),
    quotePlugin(),
    headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
    linkPlugin(),
    linkDialogPlugin(),
    imagePlugin({
      ImageDialog: CustomImageDialog,
    }),
    tablePlugin(),
    thematicBreakPlugin(),
    frontmatterPlugin(),
    codeBlockPlugin({ defaultCodeBlockLanguage: '' }),
    // sandpackPlugin({ sandpackConfig: virtuosoSampleSandpackConfig }),
    codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'Plain Text', tsx: 'TypeScript', '': 'Unspecified' } }),
    // directivesPlugin({ directiveDescriptors: [YoutubeDirectiveDescriptor ] }),
    diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: originalContent }),
    markdownShortcutPlugin(),
  ])
}

export default function AttachementContentPreview({
  content,
  onChange
}: any) {
  const originalContentRef = React.useRef(content);
  const originalContent = originalContentRef.current;
  return (
    <div style={{
      height: '100%',
      overflow: 'auto',
    }}>
      <MDXEditor
        markdown={content}
        onChange={onChange}
        plugins={getPlugins(originalContent)}
        autoFocus={true}
        contentEditableClassName="daisy-prose"
      />
    </div>
  )
}
