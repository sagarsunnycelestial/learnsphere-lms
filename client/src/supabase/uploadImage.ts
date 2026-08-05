import { supabase } from "./supabaseClient";

export async function uploadImage(file: File): Promise<string> {
  const fileExt = file.name.split(".")[1];
  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("profiles")
    .upload(fileName, file, { cacheControl: "3600", upsert: false });

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("profiles").getPublicUrl(fileName);


  return publicUrl;
}
