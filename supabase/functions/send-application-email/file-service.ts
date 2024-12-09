import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

export async function downloadFileAndConvertToBase64(supabase: any, path: string): Promise<string> {
  console.log('Downloading file from path:', path);
  
  try {
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

    // Convert the blob to base64
    const arrayBuffer = await data.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    console.log('File downloaded and converted to base64 successfully');
    return base64;
  } catch (error) {
    console.error('Error in downloadFileAndConvertToBase64:', error);
    throw error;
  }
}