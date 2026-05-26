type DropDownProps = {
  options: string[]
  value: string[]
  id: string
}

export const DropDown = ({ options, value, id, ...selectProps }: DropDownProps) => {
  return (
    <>
      <select
        className="font-poppins font-semibold text-base text-[#755835] bg-[#FFF9F7] border border-[#3A250B/30] rounded-sm p-2 focus:outline-none"
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
