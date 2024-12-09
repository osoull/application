import { FormData } from "@/types/form";
import CompanyInfo from "./professional/CompanyInfo";
import ExperienceInfo from "./professional/ExperienceInfo";
import SalaryInfo from "./professional/SalaryInfo";
import AvailabilityDate from "./professional/AvailabilityDate";
import PositionInfo from "./professional/PositionInfo";

interface ProfessionalInfoFormProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  errors: Record<string, string>;
}

const ProfessionalInfoForm = ({ 
  formData, 
  handleInputChange, 
  date, 
  setDate, 
  errors 
}: ProfessionalInfoFormProps) => {
  return (
    <div className="space-y-6">
      <CompanyInfo 
        formData={formData} 
        handleInputChange={handleInputChange} 
        errors={errors} 
      />
      
      <ExperienceInfo 
        formData={formData} 
        handleInputChange={handleInputChange} 
        errors={errors} 
      />
      
      <SalaryInfo 
        formData={formData} 
        handleInputChange={handleInputChange} 
        errors={errors} 
      />
      
      <AvailabilityDate 
        date={date} 
        setDate={setDate} 
        errors={errors} 
      />
      
      <PositionInfo 
        formData={formData} 
        handleInputChange={handleInputChange} 
        errors={errors} 
      />
    </div>
  );
};

export default ProfessionalInfoForm;