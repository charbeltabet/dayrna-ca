import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faDeleteLeft, faLink } from "@fortawesome/free-solid-svg-icons";
import { handleDelete } from "./AttachmentsTableDisplay";
import { FormField } from "../../../components/FormField";
import { useInertiaForm } from "../../../hooks/useInertiaForm";
import { truncateFilename } from "../../utils";
import AttachmentGroupSelector from "../Homepage/HomeForm/AttachmentGroupSelector";

interface AttachmentPreviewProps {
  serverData: any;
}

export default function AttachmentPreview({
  serverData,
}: AttachmentPreviewProps) {
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(serverData.public_url);
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
    onCancel,
  } = useInertiaForm({
    key: 'admin_attachments',
    serverData: {
      title: serverData.title || '',
      description: serverData.description || '',
      filename: serverData.filename || '',
      file: null,
      attachments_groups: serverData.attachments_groups?.map((g: any) => g.option) || []
    },
    onPropChange: (data) => data,
    options: {
      url: `/admin/attachments/${serverData.id}`,
      method: 'patch',
    },
    routerOptions: {
      replace: false,
      preserveState: false,
      preserveScroll: true,
    },
    cleanBeforeSubmit: (data) => {
      const formData: any = {
        title: data.title,
        description: data.description,
        file: data.file?.[0],
        attachments_groups_ids: data.attachments_groups.map((group: any) => group.value)
      };

      return formData;
    }
  });

  const {
    formState: { isDirty }
  } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={onSubmit}
        onKeyDown={(e) => {
          if (e.shiftKey && e.key === 'Enter') {
            e.preventDefault();
            onSubmit(e);
          }
        }}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #ddd',
          borderRadius: '8px',
        }}
      >
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
                  href={serverData.public_url}
                  target="_blank"
                  className="link"
                >
                  {truncateFilename(serverData.filename, 20)}
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
                onClick={() => handleDelete(serverData.id, serverData.filename)}
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
                type="submit"
                className="btn btn-sm btn-success"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
                <FontAwesomeIcon icon={faCheck} />
              </button>
            </div>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            borderBottom: '1px solid #ddd',
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
              rows={6}
              registerProps={{ required: false }}
            />

            <FormField.FileInput
              name="file"
              label="Replace File"
              registerProps={{ required: false }}
            />

            <AttachmentGroupSelector
              name="attachments_groups"
              isMulti={true}
            />
          </FormField.Container>
        </div>
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
              backgroundImage: `url(${serverData.public_url})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
            }} />
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
