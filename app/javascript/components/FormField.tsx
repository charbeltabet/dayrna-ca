import { useFormContext } from 'react-hook-form';
import { get } from 'react-hook-form';
import type { RegisterOptions } from 'react-hook-form';
import clsx from 'clsx';
import { forwardRef } from 'react';

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
          paddingBottom: 8
        }}
      >
        {label}
      </legend>
      {type === 'textarea' ? (
        <textarea
          className={clsx("textarea", hasError && "input-error")}
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
          className={clsx("input", hasError && "input-error")}
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

export const FormField = {
  Container,
  Field,
  Section
}
