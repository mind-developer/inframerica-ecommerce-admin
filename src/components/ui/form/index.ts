import { createFormHook } from '@tanstack/react-form';
import { CheckboxField } from './CheckboxField';
import { CheckboxListField } from './CheckboxListField';
import { fieldContext, formContext } from './formContext';
import { NumberField } from './NumberField';
import { SelectField } from './SelectField';
import { SubmitButton } from './SubmitButton';
import { SwitchField } from './SwitchField';
import { TextAreaField } from './TextAreaField';
import { TextField } from './TextField';

/**
 * The app's form hook (TanStack Form composition). Fields render label, control and the first Zod error
 * consistently: `<form.AppField name="email">{(f) => <f.TextField label="E-mail" />}</form.AppField>`.
 */
export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    CheckboxField,
    TextField,
    TextAreaField,
    NumberField,
    SelectField,
    SwitchField,
    CheckboxListField,
  },
  formComponents: { SubmitButton },
});

/** Prevents the native submit and hands over to TanStack Form. */
export const submitHandler = (form: { handleSubmit: () => unknown }) => (e: React.FormEvent) => {
  e.preventDefault();
  e.stopPropagation();
  void form.handleSubmit();
};
