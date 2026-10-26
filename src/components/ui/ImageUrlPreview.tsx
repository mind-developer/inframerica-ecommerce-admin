/** Preview of an arbitrary image URL typed in a form (any host, so not next/image). */
export function ImageUrlPreview({ url, alt = 'Pré-visualização da imagem' }: { url: string; alt?: string }) {
  if (!url) return null;
  // eslint-disable-next-line @next/next/no-img-element -- arbitrary admin-typed URL, not an optimizable asset
  return <img src={url} alt={alt} className="h-28 w-full rounded-lg bg-muted object-cover" />;
}
