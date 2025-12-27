import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft, faLink } from "@fortawesome/free-solid-svg-icons";
import { handleDelete } from "./AttachmentsTableDisplay";
import { FormField } from "../../../components/FormField";
import { useInertiaForm } from "../../../hooks/useInertiaForm";

interface AttachmentPreviewProps {
  attachmentRow: any;
  allGroups: Array<{ id: number; title: string }>;
}

export default function AttachmentPreview({
  attachmentRow,
  allGroups,
}: AttachmentPreviewProps) {
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(attachmentRow.public_url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const {
    formMethods,
    onSubmit,
    isSubmitting,
    onCancel
  } = useInertiaForm({
    key: 'admin_attachments',
    serverData: {
      title: attachmentRow.title || '',
      description: attachmentRow.description || '',
      filename: attachmentRow.filename || '',
      // file: undefined,
      // group_ids: attachmentRow.attachments_groups?.map((g: any) => g.id) || []
    },
    onPropChange: (data) => data,
    options: {
      url: `/admin/attachments/${attachmentRow.id}`,
      method: 'patch',
    },
    routerOptions: {
      replace: false,
      preserveState: false,
      preserveScroll: true,
    },
    cleanBeforeSubmit: (data) => {
      // Convert group_ids array to object format expected by Rails
      const formData: any = {
        title: data.title,
        description: data.description,
        filename: data.filename
      };

      // Only include file if it was changed
      if (data.file && data.file[0]) {
        formData.file = data.file[0];
      }

      // Convert array to object for Rails params
      if (data.group_ids && Array.isArray(data.group_ids)) {
        formData.group_ids = data.group_ids.reduce((acc: any, id: number, index: number) => {
          acc[index] = id;
          return acc;
        }, {});
      }

      return formData;
    }
  });

  const {
    formState: { isDirty }
  } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #ddd',
        borderRadius: '8px',
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
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '3px'
            }}>
              <div
                className="tooltip tooltip-bottom cursor-pointer"
                data-tip="In new tab"
                onClick={handleCopyLink}
              >
                <a
                  href={attachmentRow.public_url}
                  target="_blank"
                  className="link"
                >
                  {attachmentRow.filename}
                </a>
              </div>
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
              <div
                className="tooltip tooltip-bottom cursor-pointer"
                data-tip={"Delete"}
                onClick={() => handleDelete(attachmentRow.id, attachmentRow.filename)}
              >
                <FontAwesomeIcon icon={faDeleteLeft} />
              </div>
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
                  disabled={isSubmitting}
                  className="btn btn-sm"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onSubmit(e);
                }}
                className="btn btn-sm btn-success"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
        <form
          onSubmit={onSubmit}
          onKeyDown={(e) => {
            if (e.shiftKey && e.key === 'Enter') {
              e.preventDefault();
              onSubmit(e);
            }
          }}
          style={{
            flex: 1,
            // backgroundColor: 'white',
            borderBottom: '1px solid #ddd',
            // padding: '4px',
            padding: '4px',
            backgroundColor: 'white'
          }}
        >
          <FormField.Container style={{
            backgroundColor: 'var(--color-base-300)',
            padding: '4px'
          }}>
            <FormField.Field
              name="title"
              label="Title"
              registerProps={{ required: false }}
            />

            <FormField.Field
              name="description"
              label="Description"
              type="textarea"
              rows={4}
              registerProps={{ required: false }}
            />

            <FormField.Field
              name="filename"
              label="Filename"
              registerProps={{ required: false }}
            />

            <FormField.FileInput
              name="file"
              label="Replace File"
              registerProps={{ required: false }}
            />

            <FormField.GroupsSelect
              name="group_ids"
              label="Groups"
              groups={allGroups}
              registerProps={{ required: false }}
            />
          </FormField.Container>
        </form>
        <div style={{
          backgroundColor: 'white',
          padding: '4px',
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
              backgroundImage: `url(${attachmentRow.public_url})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
            }} />
          </div>
        </div>
      </div>
    </FormProvider>
  )
}
