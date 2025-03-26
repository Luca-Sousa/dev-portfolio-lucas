import { toast } from "sonner";

export const handleFileUpload = async (
  file: File | string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _type: "thumbnailUrl" | "certificateUrl" | "imagesUrl" | "iconURL",
): Promise<string | null> => {
  if (typeof file === "string") return file;

  try {
    const fileName = file.name;
    const fileContent = file.type;

    const uploadResponse = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName, fileContent }),
    });

    if (!uploadResponse.ok) throw new Error("Falha ao obter URL pré-assinada");

    const { signedUrl, fileKey } = await uploadResponse.json();

    const fileUploadResponse = await fetch(signedUrl, {
      method: "PUT",
      headers: { "Content-Type": fileContent },
      body: file,
    });

    if (!fileUploadResponse.ok) throw new Error("Falha no upload");

    const customUrl = `https://pub-14cdb793b4b54085abc21edea67d935a.r2.dev/${fileKey}`;
    return customUrl;
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    toast.error(`Erro ao subir o arquivo: ${file.name}`);
    return null;
  }
};
