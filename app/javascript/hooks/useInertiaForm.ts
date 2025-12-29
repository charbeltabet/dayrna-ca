import { useForm, UseFormProps, FieldValues } from 'react-hook-form';
import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

type InertiaOptions<T extends FieldValues> = {
  url: string;
  method?: 'post' | 'patch' | 'put' | 'delete';
  onSubmit?: never;
};

type CustomOptions<T extends FieldValues> = {
  url?: never;
  method?: never;
  onSubmit: (data: T, helpers: { setIsSubmitting: (v: boolean) => void; reset: () => void }) => void;
};

type UseInertiaFormOptions<T extends FieldValues> = UseFormProps<T> &
  (InertiaOptions<T> | CustomOptions<T>);

type UseInertiaFormParams<T extends FieldValues> = {
  key?: string;
  serverData: T;
  serverErrors?: any;
  options: UseInertiaFormOptions<T>;
  routerOptions?: any;
  onPropChange?: (data: T) => void;
  cleanBeforeSubmit?: (data: T) => T;
};

export function useInertiaForm<T extends FieldValues>({
  key = 'data',
  serverData,
  serverErrors,
  options,
  routerOptions,
  onPropChange,
  cleanBeforeSubmit = (data) => data,
}: UseInertiaFormParams<T>) {
  const {
    url,
    method = 'patch',
    onSubmit: customOnSubmit,
    ...formOptions
  } = options as any;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formMethods = useForm<T>({
    defaultValues: serverData as any,
    mode: 'onTouched',
    ...formOptions,
  });

  const {
    reset,
    handleSubmit,
    setError,
  } = formMethods;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    return handleSubmit((data) => {
      const cleanedData = cleanBeforeSubmit(data);

      if (customOnSubmit) {
        customOnSubmit(cleanedData, {
          setIsSubmitting,
          reset: () => reset(serverData)
        });
      } else {
        setIsSubmitting(true);
        router[method as 'get' | 'post' | 'put' | 'patch'](
          url,
          {
            [key]: cleanedData
          },
          {
            replace: false,
            preserveState: false,
            preserveScroll: true,
            ...routerOptions,
            onFinish: () => {
              routerOptions?.onFinish?.();
              setIsSubmitting(false)
            },
          },
        );
      }
    })()
  }

  const onCancel = () => reset(serverData);

  useEffect(() => {
    reset(serverData);

    if (onPropChange) {
      onPropChange(serverData);
    }
  }, [JSON.stringify(serverData), reset]);

  useEffect(() => {
    Object.entries(serverErrors || {}).forEach(([field, messages]) => {
      setError(field as any, {
        type: 'manual',
        message: (messages as string[]).join(' ')
      });
    });
  }, [serverErrors, setError]);

  return {
    formMethods,
    isSubmitting,
    onSubmit,
    onCancel,
  };
}