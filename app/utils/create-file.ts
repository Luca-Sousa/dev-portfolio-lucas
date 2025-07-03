export const handleFileUpload = async (file: File) => {
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      fileContent: file.type,
    }),
  });

  if (!res.ok) throw new Error("Falha ao obter URL pré-assinada");
  const { signedUrl, fileKey } = await res.json();

  await fetch(signedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  const baseUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL;
  return `${baseUrl}/${fileKey}`;
};
