import AsyncSelect from 'react-select/async';
import { debounce } from '../../AttachmentGroups/AttachmentGroupsTable';
import axios from 'axios';
import { Link } from '@inertiajs/react';
import { useFormContext, Controller } from 'react-hook-form';

interface AttachmentGroupSelectorProps {
  name: string;
  isMulti?: boolean;
}

export default function AttachmentGroupSelector({
  name,
  isMulti = false,
}: AttachmentGroupSelectorProps) {
  const { control } = useFormContext();
  const loadOptions = debounce(async (inputValue: string, callback: (options: any[]) => void) => {
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
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <fieldset
          className="fieldset"
          style={{
            padding: 0,
            display: 'inline-block',
          }}
        >
          <legend
            className={"fieldset-legend"}
            style={{
              paddingTop: 0,
              paddingBottom: 4,
            }}
          >
            Attachment Group
          </legend>
          <AsyncSelect
            cacheOptions
            loadOptions={loadOptions as any}
            value={field.value}
            onChange={field.onChange}
            formatOptionLabel={formatOptionLabel}
            loadingMessage={() => 'Searching...'}
            noOptionsMessage={({ inputValue }) =>
              inputValue ? `No groups found for "${inputValue}"` : 'Type to search'
            }
            defaultOptions={true}
            classNamePrefix="react-select"
            isMulti={isMulti}
            styles={{
              container: (styles) => ({
                ...styles,
                width: 'fit-content',
                minWidth: '325px',
              }),
              control: (styles) => ({
                ...styles,
                borderRadius: 0,
                width: 'auto',
                backgroundColor: 'var(--color-base-200)',
                cursor: 'pointer',
              }),
              valueContainer: (styles) => ({
                ...styles,
                width: 'auto',
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
        </fieldset>
      )}
    />
  )
}
