import AsyncSelect from 'react-select/async';
import { debounce } from '../../AttachmentGroups/AttachmentGroupsTable';
import axios from 'axios';
import { Link } from '@inertiajs/react';

interface ImageSelectorProps {
  value?: any;
  onChange?: (value: any) => void;
}

export default function ImageSelector({ value, onChange }: ImageSelectorProps) {
  const loadOptions = debounce(async (inputValue: string, callback: (options: any[]) => void) => {
    console.log('Searching for:', inputValue);
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
        value={value}
        onChange={onChange}
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
