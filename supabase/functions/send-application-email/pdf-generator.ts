import { PDFDocument, rgb, StandardFonts } from 'https://cdn.skypack.dev/pdf-lib';
import { ApplicationData } from './types.ts';

const primaryColor = rgb(0.17, 0.13, 0.49); // #2B227C
const textColor = rgb(0.10, 0.12, 0.17); // #1A1F2C

export async function generatePDF(data: ApplicationData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.276, 841.890]); // A4 size
  const { height } = page.getSize();
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  let yOffset = height - 50;
  const leftMargin = 50;
  const lineHeight = 25;

  // Header
  page.drawText('Job Application Details', {
    x: leftMargin,
    y: yOffset,
    size: 24,
    font: boldFont,
    color: primaryColor,
  });
  yOffset -= lineHeight * 2;

  const addSection = (title: string) => {
    page.drawText(title, {
      x: leftMargin,
      y: yOffset,
      size: 16,
      font: boldFont,
      color: primaryColor,
    });
    yOffset -= lineHeight;
  };

  const addField = (label: string, value: string) => {
    page.drawText(`${label}:`, {
      x: leftMargin,
      y: yOffset,
      size: 12,
      font: boldFont,
      color: textColor,
    });
    page.drawText(value || 'Not provided', {
      x: leftMargin + 150,
      y: yOffset,
      size: 12,
      font: font,
      color: textColor,
    });
    yOffset -= lineHeight;
  };

  // Personal Information
  addSection('Personal Information');
  addField('Name', `${data.firstName} ${data.lastName} (${data.firstNameAr} ${data.lastNameAr})`);
  addField('Email', data.email);
  addField('Phone', data.phone);
  addField('LinkedIn', data.linkedin);
  addField('Portfolio', data.portfolioUrl);
  yOffset -= lineHeight;

  // Professional Information
  addSection('Professional Information');
  addField('Position Applied For', data.positionAppliedFor);
  addField('Current Position', data.currentPosition);
  addField('Current Company', data.currentCompany);
  addField('Years of Experience', data.yearsOfExperience);
  addField('Expected Salary', data.expectedSalary);
  addField('Current Salary', data.currentSalary);
  addField('Notice Period', data.noticePeriod);
  yOffset -= lineHeight;

  // Education
  addSection('Education');
  addField('Education Level', data.educationLevel);
  addField('University', data.university);
  addField('Major', data.major);
  addField('Graduation Year', data.graduationYear?.toString());
  yOffset -= lineHeight;

  // Special Motivation
  addSection('Special Motivation');
  const words = data.specialMotivation.split(' ');
  let currentLine = '';
  const maxWidth = 400;

  for (const word of words) {
    const testLine = currentLine + word + ' ';
    const width = font.widthOfTextAtSize(testLine, 12);
    
    if (width > maxWidth) {
      page.drawText(currentLine, {
        x: leftMargin,
        y: yOffset,
        size: 12,
        font: font,
        color: textColor,
      });
      yOffset -= lineHeight;
      currentLine = word + ' ';
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    page.drawText(currentLine, {
      x: leftMargin,
      y: yOffset,
      size: 12,
      font: font,
      color: textColor,
    });
  }

  return await pdfDoc.save();
}