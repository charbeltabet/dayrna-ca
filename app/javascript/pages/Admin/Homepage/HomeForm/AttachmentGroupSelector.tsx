import AsyncSelect from 'react-select/async';
import { debounce } from '../../AttachmentGroups/AttachmentGroupsTable';
import axios from 'axios';
import { Link } from '@inertiajs/react';

interface AttachmentGroupSelectorProps {
  value?: any;
  onChange?: (value: any) => void;
}

export default function AttachmentGroupSelector({ value, onChange }: AttachmentGroupSelectorProps) {
  const loadOptions = debounce(async (inputValue: string, callback: (options: any[]) => void) => {
    console.log('Searching for groups:', inputValue);
    const response = await axios.get('/admin/attachments/groups/search', {
      params: {
        query: inputValue,
      }
    })
    const options = response.data
    callback(options);
  }, 400);

  const formatOptionLabel = (option: any) => {
    return (
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1">
          <div className="font-medium">{option.label}</div>
          {option.description && (
            <div className="text-sm text-gray-600">{option.description}</div>
          )}
        </div>
        {option.attachment_count !== undefined && (
          <span className="badge badge-sm badge-neutral">
            {option.attachment_count} {option.attachment_count === 1 ? 'attachment' : 'attachments'}
          </span>
        )}
      </div>
    )
  };

  return (
    <div>
      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '13px' }}>
        Attachment Group
      </label>
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions as any}
        value={value}
        onChange={onChange}
        formatOptionLabel={formatOptionLabel}
        loadingMessage={() => 'Searching...'}
        noOptionsMessage={({ inputValue }) =>
          inputValue ? `No groups found for "${inputValue}"` : 'Type to search'
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
      <Link href="/admin/attachments/groups" className="link link-primary">
        Manage or create Attachment Groups
      </Link>
    </div>
  )
}
