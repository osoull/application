import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

export async function downloadFile(supabase: SupabaseClient, path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('applications')
    .download(path);

  if (error) {
    throw new Error(`Error downloading file: ${error.message}`);
  }

  const buffer = await data.arrayBuffer();
  return Buffer.from(buffer).toString('base64');
}