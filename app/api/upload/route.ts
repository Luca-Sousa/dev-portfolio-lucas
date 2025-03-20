import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { r2 } from "@/app/lib/r2client";

export async function POST(request: Request) {
  try {
    // Valida o corpo da requisição
    const uploadBodySchema = z.object({
      fileName: z.string().min(1),
      fileContent: z.string().regex(/\w+\/[-+.\w]+/),
    });

    const body = await request.json();
    const { fileName, fileContent } = uploadBodySchema.parse(body);

    // Gera uma chave única para o arquivo
    const fileKey = randomUUID().concat("-").concat(fileName);

    // Configura o comando para o S3/R2
    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET,
      Key: fileKey,
      ContentType: fileContent,
    });

    // Gera a URL pré-assinada
    const signedUrl = await getSignedUrl(r2, command, { expiresIn: 600 });

    // Retorna a URL assinada
    return NextResponse.json({ signedUrl, fileKey }, { status: 200 });
  } catch (error) {
    console.error("Erro ao gerar URL pré-assinada:", error);
    return NextResponse.json(
      { error: "Falha ao gerar URL pré-assinada" },
      { status: 500 },
    );
  }
}
