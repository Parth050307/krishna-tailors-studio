import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { storage } from "@/lib/storage";

type UploadRow = {
  id: string;
  file_name: string;
  file_path: string | null;
  mime_type: string;
  file_size: number;
};

/**
 * Reference images/PDFs attached to an order. Files stay in the private bucket;
 * we mint a short-lived signed URL per file for people RLS already allows.
 */
export function OrderReferenceFiles({ orderId }: { orderId: string }) {
  const { data } = useQuery({
    queryKey: ["order-uploads", orderId],
    queryFn: async () => {
      const { data: rows, error } = await supabase
        .from("order_uploads")
        .select("id, file_name, file_path, mime_type, file_size")
        .eq("order_id", orderId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      const list = (rows ?? []) as UploadRow[];
      return Promise.all(
        list.map(async (row) => ({
          ...row,
          signedUrl: row.file_path ? await storage.signedUrl(row.file_path, 60 * 10) : null,
        })),
      );
    },
  });

  if (!data || data.length === 0) return null;

  return (
    <div className="mt-4 border-t border-border pt-3">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">
        Reference files ({data.length})
      </p>
      <ul className="mt-2 flex flex-wrap gap-3 text-sm">
        {data.map((file) => (
          <li key={file.id}>
            {file.signedUrl ? (
              <a
                href={file.signedUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline"
              >
                {file.file_name}
              </a>
            ) : (
              <span className="text-muted-foreground">{file.file_name}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
