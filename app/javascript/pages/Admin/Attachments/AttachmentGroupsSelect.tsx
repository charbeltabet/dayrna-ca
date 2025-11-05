import { Link } from '@inertiajs/react';
import Select from 'react-select';

interface AttachmentGroup {
  id: number;
  title: string;
}

interface AttachmentGroupsSelectProps {
  selectedGroupIds?: number[];
  groups: AttachmentGroup[];
  selectedGroups?: AttachmentGroup[];
  onChange: (groupIds: number[]) => void;
  disabled?: boolean;
  name?: string;
}

export default function AttachmentGroupsSelect({
  selectedGroupIds = [],
  groups = [],
  selectedGroups = [],
  onChange,
  disabled = false,
  name
}: AttachmentGroupsSelectProps) {

  // Merge available groups with selected groups to ensure all selected groups appear in options
  const allGroupsMap = new Map<number, AttachmentGroup>();

  // Add all available groups
  groups.forEach(group => {
    allGroupsMap.set(group.id, group);
  });

  // Add selected groups (these might not be in the groups list)
  selectedGroups.forEach(group => {
    if (!allGroupsMap.has(group.id)) {
      allGroupsMap.set(group.id, group);
    }
  });

  const options = Array.from(allGroupsMap.values()).map(group => ({
    value: group.id,
    label: group.title
  }));

  const selectedOptions = options.filter(option =>
    selectedGroupIds.includes(option.value)
  );

  const handleChange = (selected: any) => {
    const newGroupIds = selected ? selected.map((s: any) => s.value) : [];
    onChange(newGroupIds);
  };

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">Groups</span>
      </label>
      <Select
        isMulti
        isClearable
        value={selectedOptions}
        onChange={handleChange}
        options={options}
        isDisabled={disabled}
        placeholder="Select groups..."
        className="select-primary"
        classNamePrefix="select"
        menuPlacement="top"
        menuPosition="fixed"
        hideSelectedOptions={false}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          option: (base) => ({
            ...base,
            cursor: 'pointer',
          }),
          control: (base) => ({
            ...base,
            borderColor: '#d1bea7',
            borderRadius: '0',
            backgroundColor: 'var(--color-base-100)',
            boxShadow: 'none',
            cursor: 'pointer',
            '&:hover': {
              borderColor: '#d1bea7',
            },
          }),
          input: (base) => ({
            ...base,
            margin: 0,
            padding: 0,
            cursor: 'text'
          }),
          valueContainer: (base) => ({
            ...base,
            padding: '2px 8px',
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: '#570df8',
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: 'white',
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: 'white',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#4506cb',
              color: 'white',
            }
          })
        }}
      />
      {/* Hidden inputs for Inertia form submission */}
      {name && selectedGroupIds.map((groupId) => (
        <input
          key={groupId}
          type="hidden"
          name={`${name}[]`}
          value={groupId}
        />
      ))}
      <Link href="/admin/attachments" className="link link-primary">
        Manage or create Groups
      </Link>
    </div>
  );
}
