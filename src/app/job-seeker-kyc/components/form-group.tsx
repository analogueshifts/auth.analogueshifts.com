"use client";
import Image from "next/image";
import X from "@/assets/images/job-seeker-kyc/x.svg";

import { motion, AnimatePresence } from "framer-motion";
import Dropdown from "./dropdown";

interface FormGroupProps {
  label: string;
  placeholder: string;
  value: string | string[];
  setValue: any;
  valueType: string;
  list: string[];
  inCludeSearchBar: boolean;
}

const FormGroup: React.FC<FormGroupProps> = ({
  label,
  value,
  setValue,
  valueType,
  list,
  placeholder,
  inCludeSearchBar,
}) => {
  return (
    <div className="w-full flex flex-col gap-3 large:gap-4">
      <div className="w-full flex justify-between">
        <p className="large:text-base text-sm font-normal text-tremor-content-grayText">
          {label}
        </p>
        {valueType === "multiple" && (
          <Dropdown
            valueType={valueType}
            inCludeSearchBar={inCludeSearchBar}
            label={label}
            list={list}
            placeholder={placeholder}
            setValue={setValue}
            value={value}
          />
        )}
      </div>
      {valueType === "single" && typeof value === "string" && (
        <Dropdown
          valueType={valueType}
          inCludeSearchBar={inCludeSearchBar}
          label={label}
          list={list}
          placeholder={placeholder}
          setValue={setValue}
          value={value}
        />
      )}
      {valueType === "multiple" && typeof value !== "string" && (
        <>
          <div className="w-full flex flex-wrap items-start gap-2 p-5 large:p-6 rounded-2xl border border-tremor-border-boulder200 h-max min-h-[124px]">
            {value.length === 0 ? (
              <p className="font-normal text-tremor-content-boulder300 large:text-base text-sm">
                Add your skills
              </p>
            ) : (
              <AnimatePresence initial={false} mode="popLayout">
                {value.map((item: string, index: number) => {
                  return (
                    <motion.div
                      layout
                      key={index}
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ type: "spring" }}
                      className="bg-tremor-content-asYellow rounded-[2px] flex items-center px-1.5 py-1"
                    >
                      <p className="text-white text-[13px] font-normal">
                        {item?.toUpperCase()}
                      </p>
                      <button
                        type="button"
                        className="outline-none bg-none"
                        onClick={() =>
                          setValue((prev: string[]) =>
                            prev.filter((v: string) => v !== item)
                          )
                        }
                      >
                        <Image src={X} alt="" />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
          <p className="font-normal text-tremor-content-boulder950 large:text-base text-sm mb-2">
            You can select a maximum of 12 skills
          </p>
        </>
      )}
    </div>
  );
};

export default FormGroup;
