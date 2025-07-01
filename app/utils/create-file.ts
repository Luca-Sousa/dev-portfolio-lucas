import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "../lib/r2client";

export const handleFileUpload = async (
  file: File,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _type: "thumbnailUrl" | "certificateUrl" | "imagesUrl" | "iconURL",
): Promise<string | undefined> => {
  try {
    // Gera um nome único para o arquivo
    // Use crypto.randomUUID() do navegador se disponível, senão um fallback
    const uuid =
      typeof window !== "undefined" && window.crypto && window.crypto.randomUUID
        ? window.crypto.randomUUID()
        : Math.random().toString(36).substring(2) + Date.now().toString(36);
    const fileKey = `${uuid}-${file.name}`;

    // Lê o conteúdo do arquivo (File para Buffer)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Faz upload direto para o bucket
    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET!,
        Key: fileKey,
        Body: buffer,
        ContentType: file.type,
      }),
    );

    // Retorna a URL pública do arquivo
    return `https://pub-cc396dbf1dd44f8dad20a09f8a694ebd.r2.dev/${fileKey}`;
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    return undefined;
  }
};
