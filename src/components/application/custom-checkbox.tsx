import { Check } from "lucide-react";

export default function CustomCheckBox({ checked }: { checked: boolean }) {
  return (
    <div
      className={`large:w-6 flex justify-center items-center tablet:w-4 tablet:h-4 large:h-6 w-5 h-5 rounded border border-tremor-content-asYellow ${
        checked ? "bg-tremor-content-asYellow" : "bg-transparent"
      }`}
    >
      <Check
        className={`large:w-4 w-3 h-max text-white ${
          checked ? "block" : "hidden"
        }`}
      />
    </div>
  );
}
