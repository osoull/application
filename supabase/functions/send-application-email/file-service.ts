import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

export async function downloadFile(filePath: string): Promise<Uint8Array | null> {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data, error } = await supabase.storage
      .from('applications')
      .download(filePath);

    if (error) {
      console.error('Error downloading file:', error);
      return null;
    }

    return new Uint8Array(await data.arrayBuffer());
  } catch (error) {
    console.error('Error in downloadFile:', error);
    return null;
  }
}