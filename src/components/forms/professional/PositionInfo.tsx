import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FormData } from "@/types/form";

interface PositionInfoProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors: Record<string, string>;
}

const PositionInfo = ({ formData, handleInputChange, errors }: PositionInfoProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="positionAppliedFor">Position Applied For / المنصب المتقدم له <span className="text-red-500">*</span></Label>
        <Input
          id="positionAppliedFor"
          name="positionAppliedFor"
          required
          value={formData.positionAppliedFor}
          onChange={handleInputChange}
          className={errors.positionAppliedFor ? "border-red-500" : ""}
        />
        {errors.positionAppliedFor && (
          <p className="text-sm text-red-500">{errors.positionAppliedFor}</p>
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
    </>
  );
};

export default PositionInfo;