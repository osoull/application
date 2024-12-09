import { Database } from "@/integrations/supabase/types";

export type FormData = {
  firstName: string;
  firstNameAr: string;
  lastName: string;
  lastNameAr: string;
  email: string;
  phone: string;
  linkedin: string;
  portfolioUrl: string;
  coverLetter: File | null;
  resume: File | null;
  expectedSalary: string;
  currentSalary: string;
  noticePeriod: string;
  yearsOfExperience: string;
  currentCompany: string;
  currentPosition: string;
  positionAppliedFor: string;
  educationLevel: string;
  university: string;
  major: string;
  graduationYear: string;
  specialMotivation: string;
};

export type JobInsert = Database["public"]["Tables"]["jobs"]["Insert"];