import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface Params {
  handleRetry: () => void;
  status: string;
}

export default function ShowStatus({ status, handleRetry }: Params) {
  const router = useRouter();

  const action = () => {
    if (status === "error") {
      handleRetry();
    } else {
      let redirect = Cookies.get("redirect-from-verification");
      if (redirect) {
        router.push(redirect);
        Cookies.remove("redirect-from-verification");
      } else {
        router.push("/app-login");
      }
    }
  };

  return (
    <div className="large:pt-[260px] pt-32 flex justify-center px-6">
      <div className="w-[540px] max-w-full flex flex-col items-center">
        <Image
          width={104}
          height={104}
          src={status === "error" ? "/error.svg" : "/verified.svg"}
          alt=""
          className="large:mb-6 mb-3 large:w-[104px] w-20 h-max"
        />
        <h2 className="text-center leading-48 large:leading-[60px] text-black font-semibold large:text-32 text-2xl mb-2">
          {status === "error" ? "Error!" : " Email Verified!"}
        </h2>
        <p className="font-normal text-tremor-content-boulder400 mb-5 large:mb-10 large:text-xl text-base text-center">
          {status === "error"
            ? "Oops! Something went wrong, Retry"
            : "Your account has been verified successfully"}
        </p>
        <button
          type="submit"
          onClick={action}
          className={`w-full bg-tremor-content-asYellow large:h-[60px] h-12 rounded-[20px] flex justify-center items-center text-sm large:text-base font-semibold text-tremor-content-light mt-7 large:mt-10`}
        >
          {status === "error" ? "Try Again!" : "Done!"}
        </button>
      </div>
    </div>
  );
}
