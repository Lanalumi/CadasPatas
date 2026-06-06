type DropDownProps = {
  label?: string
  options: string[]
  value: string[]
  id: string
}

export const DropDown = ({ label, options, value, id, ...selectProps }: DropDownProps) => {
  return (
    <>
      <div className="flex flex-col max-w-60">
        {label && (
          <label className="font-poppins font-semibold text-base text-[#755835]" htmlFor={id}>
            {label}
          </label>
        )}
      </div>
      <select
        className=" font-poppins font-semibold text-base text-[#755835] bg-[#FFF9F7] border border-[#3A250B]/30 rounded-sm p-2 focus:outline-none max-w-30"
        {...selectProps}
        id={id}
      >
        {options.map((option, index) => (
          <option key={index} value={value[index]}>
            {option}
          </option>
        ))}
      </select>
    </>
  )
}
