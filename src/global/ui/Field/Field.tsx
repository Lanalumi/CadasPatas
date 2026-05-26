type FieldProps = {
  label?: string
  id: string
  type: string
}

export const Field = ({ label, id, type, ...inputProps }: FieldProps) => {
  return (
    <div className="flex flex-col grow">
      {label && (
        <label className="font-poppins font-semibold py-2 px-4 text-base text-[#755835]" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        className="color-[#755835] bg-[#FFF9F7] border border-[#3A250B/30] rounded-md p-2"
        id={id}
        type={type}
        {...inputProps}
      />
    </div>
  )
}
