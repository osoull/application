export interface ApplicationData {
  firstName: string;
  firstNameAr: string;
  lastName: string;
  lastNameAr: string;
  email: string;
  phone: string;
  linkedin: string;
  portfolioUrl: string;
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
  coverLetterUrl: string;
  resumeUrl: string;
  specialMotivation: string;
}

export interface EmailAttachment {
  content: string;
  filename: string;
  type: string;
  disposition: string;
}