import { FormData } from "@/types/form";
import NameFields from "./personal/NameFields";
import ContactFields from "./personal/ContactFields";
import ProfileLinks from "./personal/ProfileLinks";

interface PersonalInfoFormProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors: Record<string, string>;
}

const PersonalInfoForm = ({ formData, handleInputChange, errors }: PersonalInfoFormProps) => {
  if (!formData) {
    return null;
  }

  return (
    <div className="space-y-6">
      <NameFields 
        formData={formData} 
        handleInputChange={handleInputChange} 
        errors={errors} 
      />
      
      <ContactFields 
        formData={formData} 
        handleInputChange={handleInputChange} 
        errors={errors} 
      />
      
      <ProfileLinks 
        formData={formData} 
        handleInputChange={handleInputChange} 
        errors={errors} 
      />
    </div>
  );
};

export default PersonalInfoForm;