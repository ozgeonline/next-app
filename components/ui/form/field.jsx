export default function FormInput({
  label,
  id,
  name,
  type = "text",
  required = false,
  rows,
  defaultValue,
  readOnly
}) {
  return (
    <p>
      <label htmlFor={id}>{label}</label>
      {rows ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          required={required}
          defaultValue={defaultValue}
          readOnly={readOnly}
        ></textarea>
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          required={required}
          readOnly={readOnly}
          {...(readOnly ? { value: defaultValue } : { defaultValue })}
        />
      )}
    </p>
  );
}
