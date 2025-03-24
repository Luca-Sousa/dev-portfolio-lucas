export const deleteFileFromBucket = async (fileKey: string) => {
  try {
    const response = await fetch("/api/upload", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileKey }),
    });

    if (!response.ok) {
      throw new Error("Falha ao deletar o arquivo");
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Erro ao deletar o arquivo:", error);
    throw new Error("Erro ao deletar o arquivo");
  }
};
