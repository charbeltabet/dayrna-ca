import { useState, useEffect } from 'react';

interface FileInputFormProps {
  file: File;
  filename: string;
  title: string;
  description: string;
  group_ids: number[];
  allGroups: Array<{ id: number; title: string }>;
  onChange: (field: 'filename' | 'title' | 'description' | 'group_ids', value: string | number[]) => void;
  onRemove: () => void;
}

export default function FileInputForm({
  file,
  filename,
  title,
  description,
  group_ids,
  allGroups,
  onChange,
  onRemove,
}: FileInputFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const isImage = file.type.startsWith('image/');

  // Generate preview URL for images
  useEffect(() => {
    if (isImage) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Cleanup on unmount
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file, isImage]);

  // Get file extension
  const getFileExtension = () => {
    const parts = file.name.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'FILE';
  };

  return (
    <div className="border border-base-300 bg-base-100">
      <div className="flex gap-3 p-3">
        {/* Preview/Icon Section */}
        <div className="flex-shrink-0">
          {isImage && previewUrl ? (
            <img
              src={previewUrl}
              alt={filename}
              className="w-16 h-16 object-cover border border-base-300"
            />
          ) : (
            <div className="w-16 h-16 bg-base-300 flex flex-col items-center justify-center border border-base-300">
              <div className="text-xs font-bold text-base-content/70">
                {getFileExtension()}
              </div>
              <div className="text-[10px] text-base-content/50 mt-1">
                {(file.size / 1024).toFixed(0)}KB
              </div>
            </div>
          )}
        </div>

        {/* Form Fields Section */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header with filename and remove button */}
          <div className="flex items-start justify-between gap-2">
            <div className="text-xs font-medium text-base-content/70 truncate flex-1">
              {file.name}
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="text-error hover:text-error-focus text-xs font-medium flex-shrink-0"
            >
              Remove
            </button>
          </div>

          {/* Compact form fields */}
          <div className="space-y-1.5">
            <div className="form-control">
              <label className="label py-0 pb-1">
                <span className="label-text text-xs">Filename</span>
              </label>
              <input
                type="text"
                value={filename}
                onChange={(e) => onChange('filename', e.target.value)}
                className="input input-bordered input-xs w-full"
              />
            </div>

            <div className="form-control">
              <label className="label py-0 pb-1">
                <span className="label-text text-xs">Title <span className="text-base-content/50">(optional)</span></span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => onChange('title', e.target.value)}
                className="input input-bordered input-xs w-full"
              />
            </div>

            <div className="form-control">
              <label className="label py-0 pb-1">
                <span className="label-text text-xs">Description <span className="text-base-content/50">(optional)</span></span>
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => onChange('description', e.target.value)}
                className="input input-bordered input-xs w-full"
              />
            </div>

            <div style={{ fontSize: '12px' }}>
              {/* <AttachmentGroupsSelect
                selectedGroupIds={group_ids}
                groups={allGroups}
                onChange={(groupIds) => onChange('group_ids', groupIds)}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
