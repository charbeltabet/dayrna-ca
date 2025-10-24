interface FileInputFormProps {
  file: File;
  filename: string;
  title: string;
  description: string;
  onChange: (field: 'filename' | 'title' | 'description', value: string) => void;
  onRemove: () => void;
}

export default function FileInputForm({
  file,
  filename,
  title,
  description,
  onChange,
  onRemove,
}: FileInputFormProps) {
  return (
    <div style={{
      border: '1px solid #ddd',
    }}>
      <div className="card-body p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="text-sm font-medium text-base-content/70">
            {file.name}
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="link"
            style={{
              color: 'red'
            }}
          >
            Remove
          </button>
        </div>

        <div className="space-y-3">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Filename</span>
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => onChange('filename', e.target.value)}
              className="input input-bordered input-sm w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Title <span className="text-base-content/50">(optional)</span></span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => onChange('title', e.target.value)}
              className="input input-bordered input-sm w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Description <span className="text-base-content/50">(optional)</span></span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => onChange('description', e.target.value)}
              className="input input-bordered input-sm w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
