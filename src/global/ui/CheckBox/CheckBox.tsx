'use client'

import { useState } from 'react'

type CheckBoxOption = {
  label: string
  value: string
  checked?: boolean
}

type CheckBoxProps = {
  id: string
  title: string
  options: CheckBoxOption[]
}

export const CheckBox = ({ id, title, options, ...inputProps }: CheckBoxProps) => {
  const [selected, setSelected] = useState<string | null>(() => options.find((option) => option.checked)?.value ?? null)

  return (
    <div
      className=" flex flex-col w-full max-w-full
    "
    >
      {title && <h3 className="font-poppins font-semibold py-2 px-4 text-base text-[#755835]">{title}</h3>}
      <input type="hidden" name={id} value={selected ?? ''} />
      <div className="flex flex-wrap gap-2 w-full max-w-full">
        {options.map((option) => {
          const inputId = `${id}-${option.value}`

          return (
            <div key={option.value} className="flex flex-wrap items-center gap-2 min-w-0">
              <label className="font-poppins font-semibold py-2 px-4 text-base text-[#755835]" htmlFor={inputId}>
                {option.label}
              </label>
              <input
                id={inputId}
                type="checkbox"
                checked={selected === option.value}
                onChange={(event) => {
                  setSelected(event.target.checked ? option.value : null)
                }}
                {...inputProps}
                className="font-poppins font-semibold text-base text-[#755835] rounded-sm p-2 focus:outline-none"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
