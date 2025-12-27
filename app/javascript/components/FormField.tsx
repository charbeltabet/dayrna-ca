import { useFormContext, Controller } from 'react-hook-form';
import { get } from 'react-hook-form';
import type { RegisterOptions } from 'react-hook-form';
import clsx from 'clsx';
import { forwardRef } from 'react';
import Select from 'react-select';
import { Link } from '@inertiajs/react';

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
  type?: 'text' | 'textarea';
  rows?: number;
}

const Field = ({
  name,
  label,
  placeholder = '',
  hint = '',
  registerProps = {},
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
        className={clsx("file-input file-input-bordered", hasError && "input-error")}
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

interface GroupOption {
  value: number;
  label: string;
}

interface AttachmentGroup {
  id: number;
  title: string;
}

interface GroupsSelectProps {
  name: string;
  label?: string;
  groups: AttachmentGroup[];
  hint?: string;
  registerProps?: RegisterOptions;
  manageLink?: string;
}

const GroupsSelect = ({
  name,
  label = 'Groups',
  groups = [],
  hint = '',
  registerProps = {},
  manageLink = '/admin/attachments'
}: GroupsSelectProps) => {
  const { control, formState: { errors } } = useFormContext();

  const error = get(errors, name);
  const hasError = Boolean(error);

  const options: GroupOption[] = groups.map(group => ({
    value: group.id,
    label: group.title
  }));

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
      <Controller
        name={name}
        control={control}
        rules={registerProps}
        render={({ field }) => (
          <Select
            isMulti
            isClearable
            value={options.filter(option =>
              field.value?.includes(option.value)
            )}
            onChange={(selected) => {
              const newGroupIds = selected ? selected.map((s: GroupOption) => s.value) : [];
              field.onChange(newGroupIds);
            }}
            options={options}
            placeholder="Select groups..."
            className={clsx("select-primary", hasError && "border-error")}
            classNamePrefix="select"
            menuPlacement="top"
            menuPosition="fixed"
            hideSelectedOptions={false}
            menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              option: (base) => ({
                ...base,
                cursor: 'pointer',
              }),
              control: (base) => ({
                ...base,
                borderColor: hasError ? 'var(--color-error)' : '#d1bea7',
                borderRadius: '0',
                backgroundColor: 'var(--color-base-200)',
                boxShadow: 'none',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: hasError ? 'var(--color-error)' : '#d1bea7',
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
        )}
      />
      {hint && (
        <p className="label">{hint}</p>
      )}
      {error && (
        <p className="text-error">{error.message}</p>
      )}
      {manageLink && (
        <Link href={manageLink} className="link link-primary">
          Manage or create Groups
        </Link>
      )}
    </fieldset>
  )
}

export const FormField = {
  Container,
  Field,
  Section,
  FileInput,
  GroupsSelect
}
