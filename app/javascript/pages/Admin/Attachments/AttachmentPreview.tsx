import { Form } from "@inertiajs/react";
import { useState, useRef } from "react";
import { handleDelete } from "./Index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import AttachmentGroupsSelect from "./AttachmentGroupsSelect";

interface AttachmentPreviewProps {
  attachmentRow: any;
  allGroups: Array<{ id: number; title: string }>;
}

export default function AttachmentPreview({
  attachmentRow,
  allGroups,
}: AttachmentPreviewProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [groupIds, setGroupIds] = useState<number[]>(
    attachmentRow.groups?.map((g: any) => g.id) || []
  );
  const [processing, setProcessing] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(attachmentRow.url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #ddd',
      borderRadius: '8px'
    }}>
      <div style={{
        width: '100%',
      }}>
        <div style={{
          width: '100%',
          backgroundColor: '#f5f5f5',
          borderBottom: '2px solid #ddd',
          padding: '4px 8px',
          fontWeight: 'bold',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <a
              href={attachmentRow.url}
              target="_blank"
              className="link"
            >
              {attachmentRow.filename}
            </a>
            <div
              className="tooltip tooltip-bottom cursor-pointer"
              data-tip={linkCopied ? "Copied!" : "Copy link"}
              onClick={handleCopyLink}
            >
              <FontAwesomeIcon
                icon={faLink}
                className="ml-1 text-sm"
              />
            </div>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '4px',
          }}>
            <button
              className="btn btn-error"
              onClick={() => handleDelete(attachmentRow.id, attachmentRow.filename)}
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => formRef.current?.submit()}
              className="btn btn-success"
              disabled={processing}
            >
              {processing ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
      <Form
        ref={formRef as any}
        action={`/admin/attachments/${attachmentRow.id}`}
        method="patch"
        transform={(data) => {
          console.log('Form data before transform:', data);
          const afterTransform = {
            ...data,
            // Ensure group_ids is always present, defaulting to empty array
            'group_ids': data['group_ids'] || ['']
          }
          console.log('Form data after transform:', afterTransform);
          return afterTransform;
        }}
        onKeyDown={(e) => {
          if (e.shiftKey && e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.requestSubmit();
          }
        }}
        onStart={() => setProcessing(true)}
        onFinish={() => setProcessing(false)}
        onSuccess={(page) => {
          const updatedAttachment = page.props.previewed_attachment as any;
          setGroupIds(updatedAttachment.groups?.map((g: any) => g.id) || []);
        }}
        style={{
          flex: 1,
          backgroundColor: 'white',
          borderBottom: '1px solid #ddd',
          padding: '16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr)',
          gap: '12px'
        }}>
          <div>
            <label className="label">
              <span className="label-text">Filename</span>
            </label>
            <input
              type="text"
              name="filename"
              className="input input-bordered w-full"
              defaultValue={attachmentRow.filename || ''}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Replace File</span>
            </label>
            <input
              type="file"
              name="file"
              className="file-input file-input-bordered w-full"
            />
          </div>

          <AttachmentGroupsSelect
            selectedGroupIds={groupIds}
            groups={allGroups}
            selectedGroups={attachmentRow.groups || []}
            onChange={setGroupIds}
            disabled={processing}
            name="group_ids"
          />

          <div>
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              name="title"
              className="input input-bordered w-full"
              defaultValue={attachmentRow.title || ''}
            />
          </div>

          <div style={{
            gridColumn: 'span 2'
          }}>
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              className="textarea textarea-bordered w-full"
              rows={4}
              defaultValue={attachmentRow.description || ''}
            />
          </div>
        </div>
      </Form>
      <div style={{
        backgroundColor: 'white',
        padding: '3px 12px',
        display: 'flex',
        justifyContent: 'center',
        borderBottom: '1px solid #ddd'
      }}>
        <button
          onClick={() => formRef.current?.submit()}
          type="submit"
          form="attachment-form"
          className="btn btn-success"
          disabled={processing}
        >
          {processing ? 'Saving...' : 'Save'}
        </button>
      </div>
      <div style={{
        backgroundColor: 'white',
        padding: '16px',
        overflowY: 'auto',
        flex: 1
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          height: '100%',
          width: '100%',
          gap: '8px'
        }}>
          <div style={{
            flex: 1,
            height: '100%',
            backgroundImage: `url(${attachmentRow.url})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }} />
        </div>
      </div>
    </div>
  )
}
