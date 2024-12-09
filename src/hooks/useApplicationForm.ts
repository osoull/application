import { useState } from "react";
import { FormData } from "@/types/form";
import { applicationSchema } from "@/schemas/applicationSchema";

const initialFormData: FormData = {
  firstName: "",
  firstNameAr: "",
  lastName: "",
  lastNameAr: "",
  email: "",
  phone: "",
  linkedin: "",
  portfolioUrl: "",
  coverLetter: null,
  resume: null,
  expectedSalary: "",
  currentSalary: "",
  noticePeriod: "",
  yearsOfExperience: "",
  currentCompany: "",
  currentPosition: "",
  positionAppliedFor: "",
  educationLevel: "",
  university: "",
  major: "",
  graduationYear: "",
  specialMotivation: "",
};

export const useApplicationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const { name } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.files![0],
      }));
    }
  };

  const validateForm = () => {
    try {
      applicationSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const formattedErrors: Record<string, string> = {};
      error.errors.forEach((err: any) => {
        const field = err.path[0];
        formattedErrors[field] = err.message;
      });
      setErrors(formattedErrors);
      return false;
    }
  };

  return {
    formData,
    date,
    setDate,
    errors,
    isSubmitting,
    isSubmitted,
    setIsSubmitting,
    setIsSubmitted,
    handleInputChange,
    handleSelectChange,
    handleFileChange,
    validateForm,
    setFormData,
  };
};