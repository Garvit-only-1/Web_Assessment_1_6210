
import { supabase } from "./supabase";

// Read all SCP subjects
export async function getSCPs() {
  const { data, error } = await supabase
    .from("scp_subjects")
    .select("*")
    .order("item");

  if (error) throw error;

  return data || [];
}

// Add new SCP subject
export async function addSCP(scp) {
  const { data, error } = await supabase
    .from("scp_subjects")
    .insert([scp])
    .select()
    .single();

  if (error) throw error;

  return data;
}

// Update existing SCP subject
export async function updateSCP(id, scp) {
  const { data, error } = await supabase
    .from("scp_subjects")
    .update(scp)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

// Delete SCP subject
export async function deleteSCP(id) {
  const { error } = await supabase
    .from("scp_subjects")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// Check if logged-in user is an admin
export async function checkAdmin() {
  const { data, error } = await supabase
    .rpc("is_admin");

  if (error) throw error;

  return data === true;
}

// Upload an image

export async function uploadImage(file) {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Please select a JPG, PNG or WebP image.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image must be smaller than 5 MB.");
  }

  const extension = file.name.split(".").pop().toLowerCase();
  const fileName = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from("images")
    .upload(fileName, file, {
      contentType: file.type
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from("images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}


