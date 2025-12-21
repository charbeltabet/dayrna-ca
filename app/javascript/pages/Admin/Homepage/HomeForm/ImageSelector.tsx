import AsyncSelect from 'react-select/async';
import { debounce } from '../../AttachmentGroups/AttachmentGroupsTable';
import axios from 'axios';
import { Link } from '@inertiajs/react';
import { useController, useFormContext } from 'react-hook-form';

interface ImageSelectorProps {
  name: string;
  value?: any;
  onChange?: (value: any) => void;
}

export default function ImageSelector({ name, value, onChange }: ImageSelectorProps) {
  const formContext = useFormContext();

  // If used within React Hook Form context and name is provided, use controller
  const controller = formContext && name ? useController({
    name,
    control: formContext.control
  }) : null;

  // Use controller value/onChange if available, otherwise fall back to props
  const currentValue = controller?.field.value ?? value;
  const baseHandleChange = controller?.field.onChange ?? onChange;

  // Wrapper to handle both the full object and the ID field
  const handleChange = (newValue: any) => {
    if (formContext && name) {
      // Extract the field path to set the ID field
      // e.g., "scripture_slides.0.selectedImage" -> "scripture_slides.0.record_attachment_id"
      const idFieldName = name.replace(/\.selectedImage$/, '.record_attachment_id');

      // Set the full object in the selectedImage field (for UI purposes)
      baseHandleChange?.(newValue);

      // Set just the ID in the record_attachment_id field (for backend)
      formContext.setValue(idFieldName, newValue?.value || null);
    } else {
      baseHandleChange?.(newValue);
    }
  };

  const loadOptions = debounce(async (inputValue: string, callback: (options: any[]) => void) => {
    const response = await axios.get('/admin/attachments/search', {
      params: {
        query: inputValue,
      }
    })
    const options = response.data
    callback(options);
  }, 400);

  const formatOptionLabel = (option: any) => {
    return (
      <div className="flex items-center gap-2">
        <img
          src={option.thumbnail_url}
          alt={option.label}
          className="w-10 h-10 object-cover"
        />
        <div>
          <div>{option.label}</div>
          {option.description && (
            <div>
              <div>{option.description}</div>
            </div>
          )}
        </div>
      </div>
    )
  };

  return (
    <div>
      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '13px' }}>
        Image
      </label>
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions as any}
        value={currentValue}
        onChange={handleChange}
        formatOptionLabel={formatOptionLabel}
        loadingMessage={() => 'Searching...'}
        noOptionsMessage={({ inputValue }) =>
          inputValue ? `No images found for "${inputValue}"` : 'Type to search'
        }
        defaultOptions={true}
        classNamePrefix="react-select"
        styles={{
          control: (styles) => ({
            ...styles,
            borderRadius: 0,
            backgroundColor: 'var(--color-base-200)',
            cursor: 'pointer',
          }),
          input: (styles) => ({
            ...styles,
            cursor: 'text',
          }),
          option: (styles) => ({
            ...styles,
            cursor: 'pointer',
          }),
        }}
      />
      <Link href="/admin/attachments" className="link link-primary">
        Manage or create Attachments
      </Link>
    </div>
  )
}
