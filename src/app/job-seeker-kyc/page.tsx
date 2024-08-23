import Form from "./components/form";
import GoBack from "./components/go-back";

export default function Page() {
  return (
    <main className="w-full flex flex-col items-center">
      <div className="w-max absolute left-[112px] tablet:left-6 large:top-16 top-12">
        <GoBack />
      </div>
      <div className="w-[543px] max-w-[calc(100%-48px)] flex flex-col items-center large:pt-[91px] pt-[55px] tablet:pt-20">
        <h1 className="text-black large:text-32 text-2xl mb-2 font-semibold tablet:text-22">
          KYC
        </h1>
        <p className="text-center font-normal text-tremor-content-boulder400 large:text-xl text-base tablet:max-w-full leading-7 large:mb-8 mb-6 large:leading-48 max-w-[520px] large:max-w-[540px]">
          This helps us tailor recommendations based on your role preferences.
        </p>
        <Form />
      </div>
    </main>
  );
}
