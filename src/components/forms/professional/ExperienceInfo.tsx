import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from "@/types/form";

interface ExperienceInfoProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors: Record<string, string>;
}

const ExperienceInfo = ({ formData, handleInputChange, errors }: ExperienceInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="yearsOfExperience">Years of Experience / سنوات الخبرة <span className="text-red-500">*</span></Label>
        <Input
          id="yearsOfExperience"
          name="yearsOfExperience"
          required
          value={formData.yearsOfExperience}
          onChange={handleInputChange}
          placeholder="e.g., 5 years"
          className={errors.yearsOfExperience ? "border-red-500" : ""}
        />
        {errors.yearsOfExperience && (
          <p className="text-sm text-red-500">{errors.yearsOfExperience}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="noticePeriod">Notice Period / فترة الإشعار <span className="text-red-500">*</span></Label>
        <Input
          id="noticePeriod"
          name="noticePeriod"
          required
          value={formData.noticePeriod}
          onChange={handleInputChange}
          placeholder="e.g., 2 months"
          className={errors.noticePeriod ? "border-red-500" : ""}
        />
        {errors.noticePeriod && (
          <p className="text-sm text-red-500">{errors.noticePeriod}</p>
        )}
      </div>
    </div>
  );
};

export default ExperienceInfo;