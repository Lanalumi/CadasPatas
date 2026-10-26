import { FormNewClinica } from '@/modules/clinicas/components/FormNewClinica/FormNewClinica'

export default function NewClinicaPage() {
  return (
    <div className="flex max-w-[94%] flex-col items-center justify-center p-4">
      <header className="flex w-full flex-col gap-2 bg-[#FFF9F7] p-4">
        <h1 className="text-center font-poppins font-semibold text-[#755835]">Cadastro de clínica</h1>
        <div className="flex w-full flex-row items-center justify-center gap-2 text-center">
          <img src="/images/icons/paw.svg" alt="" width={24} height={24} />
          <span className="font-poppins font-semibold text-[#755835]">Nova clínica</span>
        </div>
      </header>
      <FormNewClinica />
    </div>
  )
}
