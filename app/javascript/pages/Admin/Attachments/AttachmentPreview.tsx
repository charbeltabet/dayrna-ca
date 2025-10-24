import { Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import { handleDelete } from "./Index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";

interface AttachmentPreviewProps {
  attachmentRow: any;
}

export default function AttachmentPreview({
  attachmentRow,
}: AttachmentPreviewProps) {
  const [linkCopied, setLinkCopied] = useState(false);

  const { data, setData, patch, processing } = useForm<{
    filename: string;
    title: string;
    description: string;
    file: File | null;
  }>({
    filename: attachmentRow.filename || '',
    title: attachmentRow.title || '',
    description: attachmentRow.description || '',
    file: null,
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    patch(`/admin/attachments/${attachmentRow.id}`, {
      forceFormData: true,
      onSuccess: (page) => {
        const updatedAttachment = page.props.previewed_attachment as any;
        setData(updatedAttachment);
      }
    });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(attachmentRow.url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  console.log('attachmentRow.url', attachmentRow.url)

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
          </div>
        </div>
      </div>
      <div style={{
        flex: 1,
        backgroundColor: 'white',
        borderBottom: '1px solid #ddd',
        padding: '16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <form onSubmit={handleSubmit} onKeyDown={(e) => {
          if (e.shiftKey && e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(e);
          }
        }} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div>
            <label className="label">
              <span className="label-text">Replace File</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              onChange={(e) => setData('file', e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Filename</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={data.filename}
              onChange={(e) => setData('filename', e.target.value)}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={data.title}
              onChange={(e) => setData('title', e.target.value)}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              rows={4}
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
            />
          </div>
        </form>
      </div>
      <div style={{
        backgroundColor: 'white',
        padding: '3px 12px',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <button
          className="btn btn-success"
          onClick={handleSubmit}
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
