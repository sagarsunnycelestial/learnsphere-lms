import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import download from 'downloadjs';
import LMSLogo from '../assets/LMSlogo.png';
import { QuizResultResponse } from '../types/types';
type NewUserInfoArgs = {
  email: string;
  temp_password: string;
};
async function newUserInfoToPDF({ email, temp_password }: NewUserInfoArgs) {
  const pdfDoc = await PDFDocument.create();

  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  const page = pdfDoc.addPage();

  const { height } = page.getSize();

  const fontSize = 12;

  page.drawText(`Email: ${email}`, {
    x: 50,
    y: height - 4 * fontSize,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0.53, 0.71),
  });
  page.drawText(`Temporary password: ${temp_password}`, {
    x: 50,
    y: height - 6 * fontSize,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0.53, 0.71),
  });

  const pdfBytes = await pdfDoc.save();
  download(pdfBytes, 'user_created.pdf', 'application/pdf');
}
async function embedLogo(pdfDoc: PDFDocument, logoUrl: string) {
  const logoBytes = await fetch(logoUrl).then((res) => res.arrayBuffer());
  return pdfDoc.embedPng(logoBytes);
}
async function downloadResultPDF(result: QuizResultResponse) {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const page = pdfDoc.addPage([842, 595]); // A4 landscape
  const { height, width } = page.getSize();
  const fontSize = 12;
  const logoImage = await embedLogo(pdfDoc, LMSLogo);
  const logoDims = logoImage.scale(0.05);
  page.drawImage(logoImage, {
    x: width - logoDims.width - 50,
    y: height - logoDims.height - 30,
    width: logoDims.width,
    height: logoDims.height,
  });
  if (result.profile_image_path) {
    try {
      const imageBytes = await fetch(result.profile_image_path).then((res) => res.arrayBuffer());
      const image = result.profile_image_path.toLowerCase().endsWith('.png')
        ? await pdfDoc.embedPng(imageBytes)
        : await pdfDoc.embedJpg(imageBytes);
      const imgDims = image.scale(0.35);
      page.drawImage(image, {
        x: 50,
        y: height - imgDims.height - 30,
        width: imgDims.width,
        height: imgDims.height,
      });
    } catch {
      console.log('failed to download profile image');
    }
  }

  page.drawText(`Name: ${result.username ?? 'N/A'}`, {
    x: 130,
    y: height - 60,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0.53, 0.71),
  });
  page.drawText(`Course: ${result.courseDetail?.courseName ?? 'N/A'}`, {
    x: 50,
    y: height - 130,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0.2, 0.2, 0.2),
  });
  page.drawText(`Quiz: ${result.quizName ?? 'N/A'}`, {
    x: 50,
    y: height - 150,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0.2, 0.2, 0.2),
  });
  page.drawText(`Score: ${result.score ?? 0}`, {
    x: 50,
    y: height - 170,
    size: fontSize + 2,
    font: timesRomanFont,
    color: rgb(0.13, 0.55, 0.13),
  });

  const pdfBytes = await pdfDoc.save();
  download(pdfBytes, 'quiz_result.pdf', 'application/pdf');
}

export { newUserInfoToPDF, downloadResultPDF };
