"use client";
import { useToast } from "@/contexts/toast";
import { useState, useEffect, useRef } from "react";

import { AnimatePresence, motion } from "framer-motion";
import CustomCheckBox from "@/components/application/custom-checkbox";

import Image from "next/image";
import Search from "@/assets/images/job-seeker-kyc/search.svg";
import ChevronDown from "@/assets/images/job-seeker-kyc/chevron-down.svg";

interface Params {
  label: string;
  placeholder: string;
  value: string | string[];
  setValue: any;
  valueType: string;
  list: string[];
  inCludeSearchBar: boolean;
}

export default function Dropdown({
  value,
  label,
  placeholder,
  inCludeSearchBar,
  setValue,
  list,
  valueType,
}: Params) {
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  const dropdownRef: any = useRef(null);

  const { notifyUser }: any = useToast();

  const handleAction = (item: string) => {
    if (valueType === "single") {
      setValue(item);
      setOpen((prev) => !prev);
    } else {
      if (value.includes(item)) {
        setValue((prev: string[]) => prev.filter((i) => i !== item));
      } else {
        if (value.length >= 12) {
          notifyUser("error", "You can only select a maximum of 12");
        } else {
          setValue((prev: string[]) => [...prev, item]);
        }
      }
    }
  };

  const closeDropdown = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeDropdown);
    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={` relative h-max ${
        typeof value === "string" ? "w-full" : "w-max"
      }`}
    >
      <div
        onClick={() => setOpen((prev) => !prev)}
        className={
          typeof value === "string"
            ? "w-full  cursor-pointer text-tremor-content-boulder300 text-sm large:text-base font-normal h-14 large:h-16 rounded-2xl outline-none focus-visible:ring-0 border border-tremor-border-boulder200 px-6 flex justify-between items-center"
            : "w-max"
        }
      >
        {typeof value === "string" ? (
          <>
            {value.trim().length === 0 ? placeholder : value}{" "}
            <Image src={ChevronDown} alt="" />
          </>
        ) : (
          <p className="text-tremor-content-asYellow cursor-pointer large:text-base text-sm font-semibold">
            Add Skills
          </p>
        )}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            exit={{ scale: 0 }}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className={`form-dropdown origin-top-right z-50 p-0 absolute right-0 pr-1  h-max w-[543px] max-w-[calc(100vw-48px)] rounded-2xl border-none bg-white ${
              valueType === "single" ? "top-14 large:top-16" : "top-8 "
            }`}
          >
            <div className="w-full large:py-6 large:px-6 px-5 py-5 flex flex-col large:gap-[30px] gap-6">
              <h3 className="font-bold text-black large:text-xl text-[17px]">
                {label}
              </h3>
              {inCludeSearchBar && (
                <div className="w-full border border-[#00000014] px-4 flex items-center gap-2 rounded-[10px] h-12">
                  <Image src={Search} alt="" className="min-w-6 h-max" />
                  <input
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={"Search for " + label}
                    className="w-full outline-none bg-none border-none font-normal text-xs text-tremor-border-boulder200 py-2"
                  />
                </div>
              )}
            </div>
            <div className="dropdown-list mb-5 large:mb-6 w-full h-max flex flex-col overflow-y-auto max-h-48 large:max-h-72">
              {list
                .filter((item: string) =>
                  item.toLowerCase().includes(searchValue.trim().toLowerCase())
                )
                .map((item: string, index: number) => {
                  return (
                    <div
                      key={index}
                      onClick={() => handleAction(item)}
                      className={`large:px-6 cursor-pointer rounded-none w-full px-5 py-2 text-[13px] font-normal leading-[26px] border hover:bg-[#FFBB0A0F] hover:border-[#FFBB0A0D] hover:text-tremor-content-boulder950 flex justify-between items-center  ${
                        item === value || value.includes(item)
                          ? "border-[#FFBB0A0D] bg-[#FFBB0A0F] text-tremor-content-boulder950"
                          : "bg-transparent  border-transparent  text-tremor-content-boulder400 "
                      }`}
                    >
                      {item}{" "}
                      {valueType === "multiple" && (
                        <CustomCheckBox checked={value.includes(item)} />
                      )}
                    </div>
                  );
                })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
