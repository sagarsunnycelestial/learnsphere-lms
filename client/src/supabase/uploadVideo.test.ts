import { describe, expect, it, vi, beforeEach } from 'vitest';
import { uploadVideo } from './uploadVideo';

const mocks = vi.hoisted(() => {
  const upload = vi.fn();
  const getPublicUrl = vi.fn(() => ({
    data: { publicUrl: 'https://cdn.test/lessons/video.mp4' },
  }));
  const from = vi.fn(() => ({ upload, getPublicUrl }));

  return { upload, getPublicUrl, from };
});

vi.mock('./supabaseClient', () => ({
  supabase: { storage: { from: mocks.from } },
}));

describe('uploadVideo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.upload.mockResolvedValue({ error: null });
    mocks.getPublicUrl.mockReturnValue({
      data: { publicUrl: 'https://cdn.test/lessons/video.mp4' },
    });
  });

  it('uploads to the lessons bucket and returns the public url', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const file = new File(['video'], 'lesson.mp4', { type: 'video/mp4' });

    const result = await uploadVideo(file);

    expect(result).toBe('https://cdn.test/lessons/video.mp4');
    expect(mocks.from).toHaveBeenCalledWith('lessons-lms');
    expect(mocks.upload).toHaveBeenCalledWith(
      'lesson.mp4_100',
      file,
      expect.objectContaining({ cacheControl: '3600', upsert: false })
    );
  });

  it('throws when the upload fails', async () => {
    const error = new Error('upload failed');
    mocks.upload.mockResolvedValue({ error });
    const file = new File(['video'], 'lesson.mp4', { type: 'video/mp4' });

    await expect(uploadVideo(file)).rejects.toBe(error);
  });
});
