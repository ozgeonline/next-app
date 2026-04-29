// Reusable form field component:
// renders a labeled input or textarea based on the props provided.

export default function FormInput({
  label,
  id,
  name,
  type = "text",
  required = false,
  rows,
  defaultValue,
  readOnly,
  maxLength,
  ...rest
}) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      {rows ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          required={required}
          defaultValue={defaultValue}
          readOnly={readOnly}
          maxLength={maxLength}
          {...rest}
        ></textarea>
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          required={required}
          readOnly={readOnly}
          maxLength={maxLength}
          {...(readOnly ? { value: defaultValue } : { defaultValue })}
          {...rest}
        />
      )}
    </div>
  );
}
