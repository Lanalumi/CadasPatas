type ButtonProps<T extends React.ButtonHTMLAttributes<HTMLButtonElement>> = {
  children: React.ReactNode
  green?: boolean
  yellow?: boolean
  red?: boolean
  icon?: string
  disabled?: boolean
} & T

export const Button = <T extends React.ButtonHTMLAttributes<HTMLButtonElement>>({
  children,
  green,
  yellow,
  red,
  icon,
  disabled,
  ...props
}: ButtonProps<T>) => {
  return (
    <>
      {green && (
        <div className="bg-[#8AA36C] flex flex-row items-center justify-center gap-2 py-2 px-4 rounded-[10px] md:max-w-70 md:max-h-10 cursor-pointer">
          <img src={icon} alt="save" width={20} height={20} />
          <button
            className="flex  font-poppins font-semibold py-2 px-4 text-[14px] text-white rounded-sm focus:outline-none cursor-pointer"
            {...props}
          >
            {children}
          </button>
        </div>
      )}

      {red && (
        <div className="bg-[#FFA686] flex flex-row items-center justify-center gap-2 py-2 px-4 rounded-[10px] md:max-w-70 md:max-h-10 cursor-pointer">
          <img src="/images/icons/delete-button.svg" alt="delete" width={24} height={24} />
          <button
            className="flex font-poppins font-semibold py-2 px-4 text-[14px] text-white rounded-sm focus:outline-none cursor-pointer"
            {...props}
          >
            {children}
          </button>
        </div>
      )}
      {disabled && (
        <div className="bg-[#8AA36C] flex flex-row items-center justify-center gap-2 py-2 px-4 rounded-[10px] md:max-w-70 md:max-h-10 cursor-pointer opacity-50 pointer-events-none">
          <img src={icon} alt="save" width={20} height={20} />
          <button
            className="flex  font-poppins font-semibold py-2 px-4 text-[14px] text-white rounded-sm focus:outline-none cursor-pointer"
            {...props}
          >
            {children}
          </button>
        </div>
      )}
      {!green && !yellow && !red && !disabled && (
        <button
          className="flex font-poppins font-semibold py-2 text-base text-[#755835] bg-transparent  focus:outline-none"
          {...props}
        >
          {children}
        </button>
      )}
    </>
  )
}
