"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormGroup from "./form-group";
import Cookies from "js-cookie";

import skillsData from "../resources/skills.json";
import rolesData from "../resources/roles.json";
import experiencesData from "../resources/years-of-experience.json";
import experienceLevelsData from "../resources/level-of-experience.json";

export default function Form() {
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState([]);
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [levelOfExperience, setLevelOfExperience] = useState("");

  const router = useRouter();

  const validateFields = () => {
    return [role, yearsOfExperience, levelOfExperience].includes("");
  };

  useEffect(() => {
    const token = Cookies.get("token");
    let storedInfo = Cookies.get("job-seeker-kyc-info");

    if (!token) {
      router.push("/login");
    }

    if (storedInfo) {
      let data = JSON.parse(storedInfo);
      setRole(data.role);
      setSkills(data.skills);
      setYearsOfExperience(data.yearsOfExperience);
      setLevelOfExperience(data.levelOfExperience);
    }
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    let data = {
      role,
      skills,
      yearsOfExperience,
      levelOfExperience,
    };

    Cookies.set("job-seeker-kyc-info", JSON.stringify(data));
    router.push("/job-seeker-kyc/bio");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col items-center large:gap-8 gap-6 pb-48"
    >
      <FormGroup
        label="Role"
        value={role}
        setValue={setRole}
        placeholder="Enter your preferred role"
        valueType="single"
        inCludeSearchBar={true}
        list={rolesData}
      />
      <FormGroup
        label="Years of Experience"
        value={yearsOfExperience}
        setValue={setYearsOfExperience}
        placeholder="Select your years of experience"
        valueType="single"
        inCludeSearchBar={false}
        list={experiencesData}
      />
      <FormGroup
        label="Level of Experience"
        value={levelOfExperience}
        setValue={setLevelOfExperience}
        placeholder="Select your level of experience"
        valueType="single"
        inCludeSearchBar={false}
        list={experienceLevelsData}
      />
      <FormGroup
        label="Your Skills"
        value={skills}
        setValue={setSkills}
        placeholder="Add your skills"
        valueType="multiple"
        inCludeSearchBar={true}
        list={skillsData}
      />
      <button
        type="submit"
        disabled={validateFields()}
        className={`w-full bg-tremor-content-asYellow large:h-[60px] h-12 rounded-[20px] flex justify-center items-center text-sm large:text-base font-semibold text-tremor-content-light ${
          validateFields() ? "opacity-50" : "opacity-100"
        }`}
      >
        Next
      </button>
    </form>
  );
}
