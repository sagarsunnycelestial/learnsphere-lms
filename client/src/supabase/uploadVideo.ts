import { supabase } from './supabaseClient';

export async function uploadVideo(file: File): Promise<string> {
  const randomNum = Math.floor(100 + Math.random() * 900);
  const fileName = `${file.name}_${randomNum}`;

  const { error } = await supabase.storage
    .from('lessons-lms')
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('lessons-lms').getPublicUrl(fileName);

  return publicUrl;
}
