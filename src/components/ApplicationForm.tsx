import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import EducationForm from "./forms/EducationForm";
import ProfessionalInfoForm from "./forms/ProfessionalInfoForm";
import DocumentsForm from "./forms/DocumentsForm";
import SuccessNotification from "./SuccessNotification";
import { submitApplication } from "@/utils/formSubmission";
import type { FormData } from "@/types/form";
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
  educationLevel: "",
  university: "",
  major: "",
  graduationYear: "",
  specialMotivation: "",
};

const ApplicationForm = () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.error("Validation failed", errors);
      return;
    }

    if (!date) {
      console.error("Date is required");
      return;
    }

    await submitApplication(
      formData,
      date,
      setIsSubmitting,
      () => {
        setIsSubmitted(true);
        setFormData(initialFormData);
        setDate(undefined);
      },
      (error) => {
        console.error('Error submitting application:', error);
      }
    );
  };

  if (isSubmitted) {
    return <SuccessNotification firstName={formData.firstName} firstNameAr={formData.firstNameAr} />;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-rasin-primary">
            Application Form / نموذج التقديم
          </h1>
          <div className="flex justify-center items-center">
            <img 
              src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logo.svg" 
              alt="Company Logo" 
              className="h-12" 
            />
          </div>
          <p className="text-muted-foreground">
            Please complete your information to submit your application / يرجى إكمال معلوماتك لتقديم طلبك
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Personal Information / المعلومات الشخصية</h2>
            <PersonalInfoForm 
              formData={formData} 
              handleInputChange={handleInputChange}
              errors={errors}
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Education / التعليم</h2>
            <EducationForm 
              formData={formData} 
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              errors={errors}
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Professional Information / المعلومات المهنية</h2>
            <ProfessionalInfoForm 
              formData={formData} 
              handleInputChange={handleInputChange}
              date={date}
              setDate={setDate}
              errors={errors}
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Documents / المستندات</h2>
            <DocumentsForm handleFileChange={handleFileChange} />
          </div>

          <Button
            type="submit"
            className="w-full bg-rasin-primary hover:bg-opacity-90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting... / جارٍ الإرسال..." : "Submit Application / إرسال الطلب"}
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default ApplicationForm;