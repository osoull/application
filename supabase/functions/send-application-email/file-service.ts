import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

export async function downloadFile(supabase: SupabaseClient, path: string): Promise<Buffer> {
  const { data, error } = await supabase.storage
    .from('applications')
    .download(path);

  if (error) {
    console.error('Error downloading file:', error);
    throw error;
  }

  if (!data) {
    throw new Error('No data received from storage');
  }

  // Convert the blob to a buffer
  const arrayBuffer = await data.arrayBuffer();
  return Buffer.from(arrayBuffer);
}