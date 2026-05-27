type ButtonProps = {
  children: React.ReactNode
  green?: boolean
  yellow?: boolean
  red?: boolean
}

export const Button = ({ children, green, yellow, red }: ButtonProps) => {
  return (
    <>
      {green && (
        <div className="bg-[#8AA36C] flex  items-center justify-center gap-2 py-2 px-4 rounded-sm h-8 w-28 cursor-pointer">
          <img src="/images/icons/save-button.svg" alt="save" width={24} height={24} />
          <button className="flex  font-poppins font-semibold py-2 px-4 text-base text-white rounded-sm focus:outline-none cursor-pointer">
            {children}
          </button>
        </div>
      )}
      {yellow && (
        <div className="bg-[#F0CA72] flex flex-row items-center justify-center gap-2 py-2 px-4 rounded-sm h-8 w-28 cursor-pointer">
          <img src="/images/icons/edit-button.svg" alt="update" width={24} height={24} />
          <button className="flex font-poppins font-semibold py-2 px-4 text-base text-white rounded-sm focus:outline-none cursor-pointer">
            {children}
          </button>
        </div>
      )}
      {red && (
        <div className="bg-[#FFA686] flex flex-row items-center justify-center gap-2 py-2 px-4 rounded-sm h-8 w-28 cursor-pointer">
          <img src="/images/icons/delete-button.svg" alt="delete" width={24} height={24} />
          <button className="flex font-poppins font-semibold py-2 px-4 text-base text-white rounded-sm focus:outline-none cursor-pointer">
            {children}
          </button>
        </div>
      )}
      {!green && !yellow && !red && (
        <button className="flex font-poppins font-semibold py-2 px-4 text-base text-[#755835] bg-[#FFF9F7] border border-[#3A250B/30] rounded-sm p-2 focus:outline-none">
          {children}
        </button>
      )}
    </>
  )
}
