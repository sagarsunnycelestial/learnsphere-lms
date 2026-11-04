/* eslint-disable */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { newUserInfoToPDF, downloadResultPDF } from './pdfHandler';

const mocks = vi.hoisted(() => {
  const page = {
    getSize: vi.fn(() => ({ width: 842, height: 595 })),
    drawText: vi.fn(),
    drawImage: vi.fn(),
  };
  const pdfDoc = {
    embedFont: vi.fn(async () => ({ font: true })),
    addPage: vi.fn(() => page),
    embedPng: vi.fn(async () => ({ scale: () => ({ width: 20, height: 20 }) })),
    embedJpg: vi.fn(async () => ({ scale: () => ({ width: 20, height: 20 }) })),
    save: vi.fn(async () => new Uint8Array([1, 2, 3])),
  };

  return {
    page,
    pdfDoc,
    create: vi.fn(async () => pdfDoc),
    download: vi.fn(),
  };
});

vi.mock('pdf-lib', () => ({
  PDFDocument: { create: mocks.create },
  StandardFonts: { TimesRoman: 'Times-Roman' },
  rgb: vi.fn(() => ({ red: 0, green: 0, blue: 0 })),
}));
vi.mock('downloadjs', () => ({ default: mocks.download }));

function buildResult(overrides: Record<string, unknown> = {}) {
  return {
    username: 'student',
    courseDetail: { courseName: 'Test Course', isActive: true },
    quizName: 'Test Quiz',
    score: 80,
    profile_image_path: null,
    ...overrides,
  } as any;
}

describe('pdfHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ arrayBuffer: async () => new ArrayBuffer(8) }))
    );
  });

  describe('newUserInfoToPDF', () => {
    it('draws the credentials and downloads the PDF', async () => {
      await newUserInfoToPDF({
        email: 'new@test.com',
        temp_password: 'temp1234',
      });

      expect(mocks.page.drawText).toHaveBeenCalledWith(
        'Email: new@test.com',
        expect.any(Object)
      );
      expect(mocks.page.drawText).toHaveBeenCalledWith(
        'Temporary password: temp1234',
        expect.any(Object)
      );
      expect(mocks.download).toHaveBeenCalledWith(
        expect.any(Uint8Array),
        'user_created.pdf',
        'application/pdf'
      );
    });
  });

  describe('downloadResultPDF', () => {
    it('writes the result summary and downloads the PDF', async () => {
      await downloadResultPDF(buildResult());

      expect(mocks.page.drawText).toHaveBeenCalledWith(
        'Name: student',
        expect.any(Object)
      );
      expect(mocks.page.drawText).toHaveBeenCalledWith(
        'Course: Test Course',
        expect.any(Object)
      );
      expect(mocks.page.drawText).toHaveBeenCalledWith(
        'Quiz: Test Quiz',
        expect.any(Object)
      );
      expect(mocks.page.drawText).toHaveBeenCalledWith(
        'Score: 80',
        expect.any(Object)
      );
      expect(mocks.download).toHaveBeenCalledWith(
        expect.any(Uint8Array),
        'quiz_result.pdf',
        'application/pdf'
      );
    });

    it('uses fallbacks for missing result fields', async () => {
      await downloadResultPDF(
        buildResult({
          username: null,
          courseDetail: null,
          quizName: null,
          score: null,
        })
      );

      expect(mocks.page.drawText).toHaveBeenCalledWith(
        'Name: N/A',
        expect.any(Object)
      );
      expect(mocks.page.drawText).toHaveBeenCalledWith(
        'Course: N/A',
        expect.any(Object)
      );
      expect(mocks.page.drawText).toHaveBeenCalledWith(
        'Quiz: N/A',
        expect.any(Object)
      );
      expect(mocks.page.drawText).toHaveBeenCalledWith(
        'Score: 0',
        expect.any(Object)
      );
    });

    it('embeds png and jpg profile images', async () => {
      await downloadResultPDF(
        buildResult({ profile_image_path: 'https://cdn.test/avatar.png' })
      );
      expect(mocks.pdfDoc.embedPng).toHaveBeenCalled();

      await downloadResultPDF(
        buildResult({ profile_image_path: 'https://cdn.test/avatar.jpg' })
      );
      expect(mocks.pdfDoc.embedJpg).toHaveBeenCalled();
    });

    it('throws when the profile image cannot be embedded', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn(async (url: string) => {
          if (url.includes('avatar')) {
            throw new Error('network');
          }
          return { arrayBuffer: async () => new ArrayBuffer(8) };
        })
      );

      await expect(
        downloadResultPDF(
          buildResult({ profile_image_path: 'https://cdn.test/avatar.png' })
        )
      ).rejects.toThrow('Failed to create pdf');
    });
  });
});
