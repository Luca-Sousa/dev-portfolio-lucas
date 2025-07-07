import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "../lib/r2client";

// Função para extrair a chave do arquivo da URL
export const extractFileKeyFromUrl = (url: string): string | null => {
  if (!url) return null;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL;
    if (!baseUrl) return null;

    // Remove a baseUrl da URL completa para obter apenas a chave
    if (url.startsWith(baseUrl)) {
      return url.replace(`${baseUrl}/`, "");
    }

    // Se não começa com baseUrl, pode ser que seja apenas a chave
    return url;
  } catch (error) {
    console.error("Erro ao extrair chave do arquivo:", error);
    return null;
  }
};

export const deleteFileFromBucket = async (fileKey: string) => {
  try {
    await r2.send(
      new DeleteObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET!,
        Key: fileKey,
      }),
    );

    return true;
  } catch (error) {
    console.error("Erro ao deletar o arquivo:", error);
    throw new Error("Erro ao deletar o arquivo");
  }
};

// Função auxiliar para deletar arquivo pela URL
export const deleteFileFromBucketByUrl = async (
  url: string,
): Promise<boolean> => {
  const fileKey = extractFileKeyFromUrl(url);
  if (!fileKey) return false;

  try {
    await deleteFileFromBucket(fileKey);
    return true;
  } catch (error) {
    console.error("Erro ao deletar arquivo pela URL:", error);
    return false;
  }
};
