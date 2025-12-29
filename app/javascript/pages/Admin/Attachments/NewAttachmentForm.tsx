import { FormProvider } from 'react-hook-form';
import { formatFileSize, FormField } from '../../../components/FormField';
import { useInertiaForm } from '../../../hooks/useInertiaForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import { urlsListIsValid, urlsToFiles } from '../../../utils/urls';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import Toast from './Toast';
import { pluralize } from '../../../utils/strings';

interface NewAttachmentFormProps {
}

export default function NewAttachmentForm({
}: NewAttachmentFormProps) {
  const {
    formMethods,
    isSubmitting,
    onSubmit,
    onCancel,
  } = useInertiaForm({
    key: 'admin_attachments',
    serverData: {
      files: [] as File[],
      files_urls: ''
    },
    onPropChange: (data) => data,
    options: {
      url: `/admin/attachments`,
      method: 'post',
    },
  });

  const {
    watch,
    formState: { isDirty },
    setValue,
  } = formMethods;

  const files = watch('files') || [] as File[];
  const hasFiles = files.length > 0;
  const filesUrls = watch('files_urls') || '';

  const handleRemoveFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setValue('files', updatedFiles, { shouldDirty: true });
  };

  const urlsAreValid = useMemo(() => (urlsListIsValid(filesUrls)), [filesUrls])

  const [fetchingFiles, setFetchingFiles] = useState(false);
  const fetchFiles = async () => {
    setFetchingFiles(true);
    try {
      const newFiles = await urlsToFiles(filesUrls);
      setFetchingFiles(false);
      setValue('files', [...files, ...newFiles]);
      setValue('files_urls', '');
      toast.custom((id) => (
        <Toast
          id={`upload-error-toast-${id}`}
          level="success"
          message={`${newFiles.length} ${pluralize(newFiles.length, 'file')} fetched successfully.`}
        />
      ))
    } catch (error) {
      toast.custom((id) => (
        <Toast
          id={`upload-error-toast-${id}`}
          level="error"
          message={String(error)}
        />
      ))
      setFetchingFiles(false);
      console.error('Error fetching files from URLs:', error);
    }
  }

  const handlePaste = (event: React.ClipboardEvent) => {
    const activeElement = document.activeElement;
    if (activeElement && activeElement.tagName === 'TEXTAREA' && activeElement.getAttribute('name') === 'files_urls') {
      // Allow default paste behavior for the URLs textarea
      return;
    }

    const items = event.clipboardData.items;
    for (const item of items) {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          event.preventDefault(); // Prevent default paste behavior
          setValue('files', [...files, file], { shouldDirty: true });
          toast.custom((id) => (
            <Toast
              id={`upload-success-toast-${id}`}
              level="success"
              message={`File "${file.name}" added successfully.`}
            />
          ));
        }
      }
    }
  };

  const loading = isSubmitting || fetchingFiles;

  const acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx'];
  const maxSingleFileSize = 100 * 1024 * 1024; // 100 MB
  const maxTotalSize = 500 * 1024 * 1024; // 500 MB
  const maxFilesCount = 50;

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={onSubmit}
        onPaste={handlePaste}
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #ddd',
          borderRadius: '8px',
          height: '100%',
        }}>
        {/* Header */}
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
              New Attachment
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '4px',
            }}>
              {isDirty && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={loading}
                  className="btn btn-sm"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="btn btn-sm btn-success"
                disabled={loading || !hasFiles}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
                <FontAwesomeIcon icon={faCheck} />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{
          backgroundColor: 'white',
          padding: '4px',
          height: '100%',
          overflow: 'auto',
        }}>
          <FormField.Container style={{
            backgroundColor: 'var(--color-base-300)',
            padding: '4px'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}>
              <FormField.Field
                name="files_urls"
                label="Fetch files from URLs"
                type="textarea"
                registerProps={{ required: false }}
                inputProps={{
                  placeholder: "https://example.com/file1.jpg\nhttps://example.com/file2.pdf\nhttps://example.com/file3.docx",
                }}
              />
              <div
                className="tooltip tooltip-right w-fit"
                data-tip={!Boolean(filesUrls) ?
                  "Enter URLs to fetch files" :
                  !Boolean(urlsAreValid) ?
                    "One or more URLs are invalid" :
                    "Fetch files from the provided URLs"
                }
              >
                <button
                  className="btn btn-primary btn-sm"
                  disabled={loading || !urlsAreValid}
                  onClick={fetchFiles}
                  type="button"
                >
                  Fetch files
                </button>
              </div>
            </div>
          </FormField.Container>

          <div className="divider text-sm my-2">OR</div>

          <FormField.Container style={{
            backgroundColor: 'var(--color-base-300)',
            padding: '4px'
          }}>
            <FormField.MultiFileInput
              name="files"
              acceptedTypes={acceptedTypes}
              maxSingleFileSize={maxSingleFileSize}
              maxTotalSize={maxTotalSize}
              maxFilesCount={maxFilesCount}
              label="Upload Files"
              registerProps={{ required: false }}

            />
          </FormField.Container>

          <div className="divider text-sm my-2">Limits</div>

          {/* File stats */}
          <div
            className="text-xs text-base-content/70 flex flex-col gap-1 mb-2"
          >
            <div>Max single file: {formatFileSize(10 * 1024 * 1024)}</div>
            <div>Max files count: 10 (used: {files.length})</div>
            <div>Max total: {formatFileSize(50 * 1024 * 1024)} (used: {formatFileSize(files.reduce((sum, file) => sum + file.size, 0))})</div>
            <div>Accepted types: {acceptedTypes.join(', ')}</div>
          </div>

          <div className="divider text-sm my-2">Inputted Files ({files.length})</div>

          {files.length > 0 && (
            <div className="flex flex-col gap-2 mb-4">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  style={{
                    backgroundColor: 'var(--color-base-300)',
                    padding: '4px'
                  }}
                >
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center gap-2 p-2 bg-base-200"
                  >
                    {/* File icon or image preview */}
                    {file.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-12 h-12 object-cover"
                        onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-base-300 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}

                    {/* File info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-sm text-sm truncate">{file.name}</div>
                      <div className="text-xs text-base-content/70">
                        {formatFileSize(file.size)}
                      </div>
                    </div>

                    {/* Remove button */}
                    <div
                      className="tooltip tooltip-left cursor-pointer"
                      data-tip="Remove"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="btn btn-sm btn-ghost btn-circle"
                        title="Remove File"
                      >
                        <FontAwesomeIcon icon={faDeleteLeft} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  )
}

