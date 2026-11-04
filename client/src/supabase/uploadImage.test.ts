import { describe, expect, it, vi, beforeEach } from 'vitest';
import { uploadImage } from './uploadImage';

const mocks = vi.hoisted(() => {
  const upload = vi.fn();
  const getPublicUrl = vi.fn(() => ({
    data: { publicUrl: 'https://cdn.test/profiles/file.png' },
  }));
  const from = vi.fn(() => ({ upload, getPublicUrl }));

  return { upload, getPublicUrl, from };
});

vi.mock('./supabaseClient', () => ({
  supabase: { storage: { from: mocks.from } },
}));

describe('uploadImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.upload.mockResolvedValue({ error: null });
    mocks.getPublicUrl.mockReturnValue({
      data: { publicUrl: 'https://cdn.test/profiles/file.png' },
    });
  });

  it('uploads to the profiles bucket and returns the public url', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const file = new File(['image'], 'avatar.png', { type: 'image/png' });

    const result = await uploadImage(file);

    expect(result).toBe('https://cdn.test/profiles/file.png');
    expect(mocks.from).toHaveBeenCalledWith('profiles');
    expect(mocks.upload).toHaveBeenCalledWith(
      'avatar.png_550',
      file,
      expect.objectContaining({ cacheControl: '3600', upsert: false })
    );
  });

  it('throws when the upload fails', async () => {
    const error = new Error('upload failed');
    mocks.upload.mockResolvedValue({ error });
    const file = new File(['image'], 'avatar.png', { type: 'image/png' });

    await expect(uploadImage(file)).rejects.toBe(error);
  });
});
