import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from "@/types/form";

interface SalaryInfoProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors: Record<string, string>;
}

const SalaryInfo = ({ formData, handleInputChange, errors }: SalaryInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="expectedSalary">Expected Salary (SAR) / الراتب المتوقع <span className="text-red-500">*</span></Label>
        <Input
          id="expectedSalary"
          name="expectedSalary"
          type="number"
          required
          value={formData.expectedSalary}
          onChange={handleInputChange}
          className={errors.expectedSalary ? "border-red-500" : ""}
        />
        {errors.expectedSalary && (
          <p className="text-sm text-red-500">{errors.expectedSalary}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="currentSalary">Current Salary (SAR) / الراتب الحالي <span className="text-red-500">*</span></Label>
        <Input
          id="currentSalary"
          name="currentSalary"
          type="number"
          required
          value={formData.currentSalary}
          onChange={handleInputChange}
          className={errors.currentSalary ? "border-red-500" : ""}
        />
        {errors.currentSalary && (
          <p className="text-sm text-red-500">{errors.currentSalary}</p>
        )}
      </div>
    </div>
  );
};

export default SalaryInfo;