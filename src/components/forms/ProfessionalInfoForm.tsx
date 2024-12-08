import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ProfessionalInfoFormProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  errors: Record<string, string>;
}

const ProfessionalInfoForm = ({ formData, handleInputChange, date, setDate, errors }: ProfessionalInfoFormProps) => {
  return (
    <div className="space-y-6">
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

      <div className="space-y-2">
        <Label>Availability Date / تاريخ الإتاحة <span className="text-red-500">*</span></Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground",
                errors.availability_date && "border-red-500"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Select date / اختر التاريخ"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              required
            />
          </PopoverContent>
        </Popover>
        {errors.availability_date && (
          <p className="text-sm text-red-500">{errors.availability_date}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialMotivation">Special Motivation for this Position / الدافع الخاص لهذا المنصب <span className="text-red-500">*</span></Label>
        <Textarea
          id="specialMotivation"
          name="specialMotivation"
          required
          value={formData.specialMotivation}
          onChange={handleInputChange}
          placeholder="Please explain your special motivation for this position / يرجى توضيح دافعك الخاص لهذا المنصب"
          className={cn("resize-none", errors.specialMotivation && "border-red-500")}
          rows={4}
        />
        {errors.specialMotivation && (
          <p className="text-sm text-red-500">{errors.specialMotivation}</p>
        )}
      </div>
    </div>
  );
};

export default ProfessionalInfoForm;