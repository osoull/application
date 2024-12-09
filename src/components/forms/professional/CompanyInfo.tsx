import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from "@/types/form";

interface CompanyInfoProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors: Record<string, string>;
}

const CompanyInfo = ({ formData, handleInputChange, errors }: CompanyInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="currentCompany">Current Company / الشركة الحالية <span className="text-red-500">*</span></Label>
        <Input
          id="currentCompany"
          name="currentCompany"
          required
          value={formData.currentCompany}
          onChange={handleInputChange}
          className={errors.currentCompany ? "border-red-500" : ""}
        />
        {errors.currentCompany && (
          <p className="text-sm text-red-500">{errors.currentCompany}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="currentPosition">Current Position / المنصب الحالي <span className="text-red-500">*</span></Label>
        <Input
          id="currentPosition"
          name="currentPosition"
          required
          value={formData.currentPosition}
          onChange={handleInputChange}
          className={errors.currentPosition ? "border-red-500" : ""}
        />
        {errors.currentPosition && (
          <p className="text-sm text-red-500">{errors.currentPosition}</p>
        )}
      </div>
    </div>
  );
};

export default CompanyInfo;