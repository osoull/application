import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from "@/types/form";

interface ProfileLinksProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors: Record<string, string>;
}

const ProfileLinks = ({ formData, handleInputChange, errors }: ProfileLinksProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn Profile <span className="text-red-500">*</span></Label>
        <Input
          id="linkedin"
          name="linkedin"
          type="url"
          required
          value={formData.linkedin}
          onChange={handleInputChange}
          placeholder="https://linkedin.com/in/username"
          className={errors.linkedin ? "border-red-500" : ""}
        />
        {errors.linkedin && (
          <p className="text-sm text-red-500">{errors.linkedin}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="portfolioUrl">Portfolio Website</Label>
        <Input
          id="portfolioUrl"
          name="portfolioUrl"
          type="url"
          value={formData.portfolioUrl}
          onChange={handleInputChange}
          placeholder="https://your-portfolio.com"
          className={errors.portfolioUrl ? "border-red-500" : ""}
        />
        {errors.portfolioUrl && (
          <p className="text-sm text-red-500">{errors.portfolioUrl}</p>
        )}
      </div>
    </div>
  );
};

export default ProfileLinks;