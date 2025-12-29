import { useFormContext, Controller } from 'react-hook-form';
import { get } from 'react-hook-form';
import type { RegisterOptions } from 'react-hook-form';
import clsx from 'clsx';
import { forwardRef, useState, useRef, useEffect } from 'react';
import { faArrowPointer, faPaste, faUpDownLeftRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ContainerProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Container = forwardRef(({ children, style }: ContainerProps, ref?: any) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      ...style
    }}
      ref={ref}
    >
      {children}
    </div>
  )
})

interface FieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  hint?: string;
  registerProps?: RegisterOptions;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>;
  type?: 'text' | 'textarea';
  rows?: number;
}

const Field = ({
  name,
  label,
  placeholder = '',
  hint = '',
  registerProps = {},
  inputProps = {},
  type = 'text',
  rows = 3
}: FieldProps) => {
  const { register, formState: { errors } } = useFormContext();

  const error = get(errors, name);
  const hasError = Boolean(error);

  return (
    <fieldset
      className="fieldset"
      style={{
        padding: 0
      }}
    >
      <legend
        className={"fieldset-legend"}
        style={{
          paddingTop: 0,
          paddingBottom: 4
        }}
      >
        {label}
      </legend>
      {type === 'textarea' ? (
        <textarea
          className={clsx("textarea textarea-bordered", hasError && "input-error")}
          placeholder={placeholder}
          rows={rows}
          {...register(
            name,
            registerProps
          )}
          style={{
            backgroundColor: 'var(--color-base-200)',
            resize: 'vertical'
          }}
          {...inputProps}
        />
      ) : (
        <input
          type="text"
          className={clsx("input input-bordered", hasError && "input-error")}
          placeholder={placeholder}
          {...register(
            name,
            registerProps
          )}
          style={{
            backgroundColor: 'var(--color-base-200)',
            color: error ? 'var(--color-error)' : 'inherit'
          }}
          {...inputProps}
        />
      )}
      {hint && (
        <p className="label">{hint}</p>
      )}
      {error && (
        <p className="text-error">{error.message}</p>
      )}
    </fieldset>
  )
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => {
  return (
    <div style={{ margin: '4px 0' }}>
      <h3
        className="text-lg font-bold"
      >
        {title}
      </h3>
      {children}
    </div>
  )
}

interface FileInputProps {
  name: string;
  label?: string;
  hint?: string;
  registerProps?: RegisterOptions;
}

const FileInput = ({
  name,
  label,
  hint = '',
  registerProps = {}
}: FileInputProps) => {
  const { register, formState: { errors } } = useFormContext();

  const error = get(errors, name);
  const hasError = Boolean(error);

  return (
    <fieldset
      className="fieldset"
      style={{
        padding: 0
      }}
    >
      <legend
        className="fieldset-legend"
        style={{
          paddingTop: 0,
          paddingBottom: 4
        }}
      >
        {label}
      </legend>
      <input
        type="file"
        className={clsx("file-input file-input-bordered file-input-sm", hasError && "input-error")}
        {...register(name, registerProps)}
      />
      {hint && (
        <p className="label">{hint}</p>
      )}
      {error && (
        <p className="text-error">{error.message}</p>
      )}
    </fieldset>
  )
}

interface MultiFileInputProps {
  name: string;
  label?: string;
  hint?: string;
  registerProps?: RegisterOptions;
  acceptedTypes?: string[];
  maxSingleFileSize?: number; // in bytes
  maxTotalSize?: number; // in bytes
  maxFilesCount?: number;
}

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const MultiFileInput = ({
  name,
  label,
  hint = '',
  registerProps = {},
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx'],
  maxSingleFileSize = 10 * 1024 * 1024, // 10MB default
  maxTotalSize = 50 * 1024 * 1024, // 50MB default
  maxFilesCount = 10
}: MultiFileInputProps) => {
  const { control, formState: { errors }, setError, clearErrors } = useFormContext();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const error = get(errors, name);
  const hasError = Boolean(error);

  const validateFiles = (currentFiles: File[], newFiles: File[]) => {
    clearErrors(name);

    // Check file count
    const totalCount = currentFiles.length + newFiles.length;
    if (totalCount > maxFilesCount) {
      setError(name, {
        type: 'manual',
        message: `Maximum ${maxFilesCount} files allowed (currently ${currentFiles.length}, trying to add ${newFiles.length})`
      });
      return false;
    }

    // Check individual file sizes
    for (const file of newFiles) {
      if (file.size > maxSingleFileSize) {
        setError(name, {
          type: 'manual',
          message: `File "${file.name}" exceeds max size of ${formatFileSize(maxSingleFileSize)}`
        });
        return false;
      }
    }

    // Check total size
    const totalSize = [...currentFiles, ...newFiles].reduce((sum, file) => sum + file.size, 0);
    if (totalSize > maxTotalSize) {
      setError(name, {
        type: 'manual',
        message: `Total size exceeds limit of ${formatFileSize(maxTotalSize)}`
      });
      return false;
    }

    return true;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={registerProps}
      defaultValue={[]}
      render={({ field: { onChange, value } }) => {
        const files = (value || []) as File[];

        const handleFiles = (newFiles: FileList | null) => {
          if (!newFiles || newFiles.length === 0) return;

          const fileArray = Array.from(newFiles);
          if (validateFiles(files, fileArray)) {
            onChange([...files, ...fileArray]);
          }
        };

        const handleDrop = (e: React.DragEvent) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
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
            if (fileArray.length > 0 && validateFiles(files, fileArray)) {
              onChange([...files, ...fileArray]);
            }
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
        }, [files]);

        const handleRemoveFile = (index: number) => {
          const newFiles = files.filter((_, i) => i !== index);
          onChange(newFiles);
          clearErrors(name);
        };

        return (
          <fieldset
            className="fieldset"
            style={{
              padding: 0
            }}
          >
            {label && (
              <legend
                className="fieldset-legend"
                style={{
                  paddingTop: 0,
                  paddingBottom: 4
                }}
              >
                {label}
              </legend>
            )}
            <div ref={containerRef} className="flex w-full flex-col">
              {/* Uploaded files list */}
              {/* Drag and drop area */}
              <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className="bg-base-200 grid place-items-center p-8 cursor-pointer transition-all"
                style={{
                  border: isDragging ? '1px solid #570df8' : '1px solid #d6cac1',
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
                <div className="mb-2">
                  Drag and drop, paste or click to select files
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 1
                }}>
                  <FontAwesomeIcon icon={faUpDownLeftRight} />
                  <FontAwesomeIcon icon={faPaste} />
                  <FontAwesomeIcon icon={faArrowPointer} />
                </div>
              </div>

              {/* Error message */}
              {hasError && (
                <div className="alert alert-error p-3 mt-2">
                  {error.message}
                </div>
              )}
            </div>
            {hint && !hasError && (
              <p className="label mt-2">{hint}</p>
            )}
          </fieldset>
        );
      }}
    />
  );
};

export const FormField = {
  Container,
  Field,
  Section,
  FileInput,
  MultiFileInput,
}
