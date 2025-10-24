import { useState, useRef } from 'react';
import FileInputForm from './FileInputForm';
import { router } from '@inertiajs/react';

interface FileWithMetadata {
  file: File;
  filename: string;
  title: string;
  description: string;
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const currentTotalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Drag and drop area */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: isDragging ? '2px dashed #570df8' : '2px dashed #ddd',
          padding: '32px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragging ? '#f0e6ff' : '#fafafa',
          transition: 'all 0.2s'
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
          style={{
            width: '48px',
            height: '48px',
            margin: '0 auto 12px',
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
        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
          Drag and drop files here
        </div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          or click to browse
        </div>
      </div>

      {/* File limits info */}
      <div style={{ fontSize: '12px', color: '#666', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div>Max single file: {formatFileSize(maxSingleFileSize)}</div>
        <div>Max total: {formatFileSize(maxTotalSize)} (used: {formatFileSize(currentTotalSize)})</div>
        {acceptedTypes.length > 0 && (
          <div>Accepted: {acceptedTypes.join(', ')}</div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div style={{
          padding: '8px 12px',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          color: '#c00',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default function NewAttachmentForm() {
  const [filesWithMetadata, setFilesWithMetadata] = useState<FileWithMetadata[]>([]);

  const setFiles = (files: File[]) => {
    // Find only the new files that aren't already in filesWithMetadata
    const existingFiles = new Set(filesWithMetadata.map(f => f.file));
    const newFiles = files.filter(file => !existingFiles.has(file));

    const newFilesWithMetadata: FileWithMetadata[] = newFiles.map(file => ({
      file,
      filename: file.name,
      title: '',
      description: ''
    }));
    setFilesWithMetadata([...filesWithMetadata, ...newFilesWithMetadata]);
  };

  const handleFileChange = (index: number, field: 'filename' | 'title' | 'description', value: string) => {
    const updated = [...filesWithMetadata];
    updated[index][field] = value;
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
    });

    setLoading(true);
    router.post(
      '/admin/attachments',
      formData,
      {
        preserveState: true,
        forceFormData: true,
        onSuccess: () => {
          setFilesWithMetadata([]);
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
            Upload Attachments
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '4px',
          }}>
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
        {filesWithMetadata.reverse().map((fileData, index) => (
          <FileInputForm
            key={`file-form-${index}`}
            file={fileData.file}
            filename={fileData.filename}
            title={fileData.title}
            description={fileData.description}
            onChange={(field, value) => handleFileChange(index, field, value)}
            onRemove={() => handleFileRemove(index)}
          />
        ))}
      </div>
      <div style={{
        backgroundColor: 'white',
        padding: '16px',
        overflowY: 'auto',
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
