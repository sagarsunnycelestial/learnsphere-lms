import { supabase } from './supabaseClient';

export async function uploadVideo(file: File): Promise<string> {
  const fileExt = file.name.split('.')[1];
  const fileName = `${crypto.randomUUID()}.${fileExt}`;

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
