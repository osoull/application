import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface AvailabilityDateProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  errors: Record<string, string>;
}

const AvailabilityDate = ({ date, setDate, errors }: AvailabilityDateProps) => {
  return (
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
  );
};

export default AvailabilityDate;