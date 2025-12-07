import { useState, useRef, useEffect } from 'react';
import FileInputForm from './FileInputForm';
import { router } from '@inertiajs/react';

interface FileWithMetadata {
  file: File;
  filename: string;
  title: string;
  description: string;
  group_ids: number[];
}

interface FileInputProps {
  files: File[];
  setFiles: (files: File[]) => void;
  acceptedTypes?: string[];
  maxSingleFileSize?: number; // in bytes
  maxTotalSize?: number; // in bytes
}

function FileInput({
  files,
  setFiles,
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx'],
  maxSingleFileSize = 10 * 1024 * 1024, // 10MB default
  maxTotalSize = 50 * 1024 * 1024 // 50MB default
}: FileInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isFetchingUrls, setIsFetchingUrls] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const validateFiles = (newFiles: File[]) => {
    setError(null);

    // Check individual file sizes
    for (const file of newFiles) {
      if (file.size > maxSingleFileSize) {
        setError(`File "${file.name}" exceeds max size of ${formatFileSize(maxSingleFileSize)}`);
        return false;
      }
    }

    // Check total size
    const totalSize = [...files, ...newFiles].reduce((sum, file) => sum + file.size, 0);
    if (totalSize > maxTotalSize) {
      setError(`Total size exceeds limit of ${formatFileSize(maxTotalSize)}`);
      return false;
    }

    return true;
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles || newFiles.length === 0) return;

    const fileArray = Array.from(newFiles);
    if (validateFiles(fileArray)) {
      setFiles([...files, ...fileArray]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset the input value to allow re-adding the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    // Handle files from clipboard
    if (e.clipboardData?.files && e.clipboardData.files.length > 0) {
      handleFiles(e.clipboardData.files);
      return;
    }

    // Handle clipboard items (for screenshots/images)
    const items = e.clipboardData?.items;
    if (items) {
      const fileArray: File[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) {
            fileArray.push(file);
          }
        }
      }
      if (fileArray.length > 0 && validateFiles(fileArray)) {
        setFiles([...files, ...fileArray]);
      }
    }
  };

  const fetchFilesFromUrls = async () => {
    if (!urlInput.trim()) {
      setError('Please enter at least one URL');
      return;
    }

    setIsFetchingUrls(true);
    setError(null);

    const urls = urlInput
      .split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    const fetchedFiles: File[] = [];
    const errors: string[] = [];

    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          errors.push(`Failed to fetch ${url}: ${response.statusText}`);
          continue;
        }

        const blob = await response.blob();

        // Extract filename from URL or Content-Disposition header
        let filename = 'downloaded-file';
        const contentDisposition = response.headers.get('Content-Disposition');
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, '');
          }
        } else {
          // Extract from URL
          const urlPath = new URL(url).pathname;
          const urlFilename = urlPath.substring(urlPath.lastIndexOf('/') + 1);
          if (urlFilename) {
            filename = urlFilename;
          }
        }

        // Add extension based on MIME type if missing
        if (!filename.includes('.')) {
          const extension = blob.type.split('/')[1];
          if (extension) {
            filename += `.${extension}`;
          }
        }

        const file = new File([blob], filename, { type: blob.type });
        fetchedFiles.push(file);
      } catch (err) {
        errors.push(`Error fetching ${url}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    setIsFetchingUrls(false);

    if (errors.length > 0) {
      setError(errors.join('; '));
    }

    if (fetchedFiles.length > 0) {
      if (validateFiles(fetchedFiles)) {
        setFiles([...files, ...fetchedFiles]);
        setUrlInput('');
      }
    } else if (errors.length === 0) {
      setError('No files could be fetched from the provided URLs');
    }
  };

  // Add paste event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('paste', handlePaste);
      return () => {
        container.removeEventListener('paste', handlePaste);
      };
    }
  }, [files, handlePaste]);

  const currentTotalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <div ref={containerRef} className="flex w-full flex-col">
      {/* URL Input Section */}
      <div className="bg-base-300 grid place-items-center p-4">
        <div className="w-full">
          <label className="label">
            <span className="label-text font-bold">Fetch files from URLs</span>
          </label>
          <div className="flex gap-2 items-start w-full">
            <input
              type="text"
              placeholder="Enter comma-separated URLs"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  fetchFilesFromUrls();
                }
              }}
              disabled={isFetchingUrls}
              className="input input-bordered w-full"
            />
            <button
              onClick={fetchFilesFromUrls}
              disabled={isFetchingUrls || !urlInput.trim()}
              className="btn btn-primary"
            >
              {isFetchingUrls ? 'Fetching...' : 'Fetch'}
            </button>
          </div>
          <div className="label">
            <span className="label-text-alt">Separate multiple URLs with commas</span>
          </div>
        </div>
      </div>

      <div className="divider">OR</div>

      {/* Drag and drop area */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="bg-base-300 grid place-items-center p-8 cursor-pointer transition-all"
        style={{
          border: isDragging ? '2px dashed #570df8' : '2px dashed #ddd',
          backgroundColor: isDragging ? '#f0e6ff' : undefined
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 mb-3 mx-auto"
          style={{
            color: isDragging ? '#570df8' : '#999'
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <div className="font-bold mb-2">
          Drag and drop or Paste
        </div>
        <div className="text-sm text-base-content/70">
          or click to browse, or paste files/images
        </div>
      </div>

      {/* File limits info */}
      <div className="text-xs text-base-content/70 flex flex-col gap-1">
        <div>Max single file: {formatFileSize(maxSingleFileSize)}</div>
        <div>Max total: {formatFileSize(maxTotalSize)} (used: {formatFileSize(currentTotalSize)})</div>
        {acceptedTypes.length > 0 && (
          <div>Accepted: {acceptedTypes.join(', ')}</div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="alert alert-error p-3">
          {error}
        </div>
      )}
    </div>
  );
}

interface NewAttachmentFormProps {
  groupId?: number | null;
  title?: string;
  onCancel?: () => void;
  allGroups?: Array<{ id: number; title: string }>;
}

export default function NewAttachmentForm({
  groupId = null,
  title = "Upload New Attachments",
  onCancel,
  allGroups = []
}: NewAttachmentFormProps = {}) {
  const [filesWithMetadata, setFilesWithMetadata] = useState<FileWithMetadata[]>([]);

  const setFiles = (files: File[]) => {
    // Find only the new files that aren't already in filesWithMetadata
    const existingFiles = new Set(filesWithMetadata.map(f => f.file));
    const newFiles = files.filter(file => !existingFiles.has(file));

    const newFilesWithMetadata: FileWithMetadata[] = newFiles.map(file => ({
      file,
      filename: file.name,
      title: '',
      description: '',
      group_ids: []
    }));
    setFilesWithMetadata([...newFilesWithMetadata, ...filesWithMetadata]);
  };

  const handleFileChange = (index: number, field: 'filename' | 'title' | 'description' | 'group_ids', value: string | number[]) => {
    const updated = [...filesWithMetadata];
    if (field === 'group_ids' && Array.isArray(value)) {
      updated[index][field] = value;
    } else if (typeof value === 'string') {
      updated[index][field as 'filename' | 'title' | 'description'] = value;
    }
    setFilesWithMetadata(updated);
  };

  const handleFileRemove = (index: number) => {
    setFilesWithMetadata(filesWithMetadata.filter((_, i) => i !== index));
  };

  // Extract just the File objects for FileInput component
  const files = filesWithMetadata.map(f => f.file);

  const [loading, setLoading] = useState(false);
  const handleSubmit = () => {
    console.log('Submitting files:', filesWithMetadata);

    // Create FormData to properly send files
    const formData = new FormData();

    filesWithMetadata.forEach((fileData, index) => {
      // Append each file with a unique key
      formData.append(`attachments[${index}][file]`, fileData.file);
      formData.append(`attachments[${index}][filename]`, fileData.filename);
      formData.append(`attachments[${index}][title]`, fileData.title);
      formData.append(`attachments[${index}][description]`, fileData.description);

      // Append group_ids for this attachment
      fileData.group_ids.forEach((groupId) => {
        formData.append(`attachments[${index}][group_ids][]`, groupId.toString());
      });
    });

    // Add group_id if provided
    if (groupId !== null && groupId !== undefined) {
      formData.append('group_id', groupId.toString());
    }

    setLoading(true);
    router.post(
      '/admin/attachments',
      formData,
      {
        preserveState: true,
        forceFormData: true,
        only: groupId ? ['previewed_group', 'attachment_groups'] : ['attachments', 'previewed_attachment'],
        onSuccess: () => {
          setFilesWithMetadata([]);
          if (onCancel) {
            onCancel();
          }
        },
        onFinish: () => {
          setLoading(false);
        }
      }
    );
  }

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
            {title}
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '4px',
          }}>
            {onCancel && (
              <button
                className="btn btn-ghost"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </button>
            )}
            <button
              className="btn btn-error"
              onClick={() => setFilesWithMetadata([])}
              disabled={filesWithMetadata.length === 0 || loading}
            >
              Discard
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={filesWithMetadata.length === 0 || loading}
            >
              {filesWithMetadata.length ? (
                <>
                  Save {filesWithMetadata.length} attachment{filesWithMetadata.length !== 1 ? 's' : ''}
                </>
              ) : (
                <>
                  Save
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      {filesWithMetadata.length > 0 && (
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
          {/* file list here */}
          {filesWithMetadata.map((fileData, index) => (
            <FileInputForm
              key={`file-form-${index}`}
              file={fileData.file}
              filename={fileData.filename}
              title={fileData.title}
              description={fileData.description}
              group_ids={fileData.group_ids}
              allGroups={allGroups}
              onChange={(field, value) => handleFileChange(index, field, value)}
              onRemove={() => handleFileRemove(index)}
            />
          ))}
        </div>
      )}
      <div style={{
        backgroundColor: 'white',
        padding: '16px',
        overflowY: 'auto',
        flex: filesWithMetadata.length > 0 ? 'none' : 1
      }}>
        <FileInput
          files={files}
          setFiles={setFiles}
          acceptedTypes={['image/*', 'application/pdf', '.doc', '.docx', '.txt']}
          maxSingleFileSize={10 * 1024 * 1024} // 10MB
          maxTotalSize={50 * 1024 * 1024} // 50MB
        />
      </div>
    </div>
  )
}
