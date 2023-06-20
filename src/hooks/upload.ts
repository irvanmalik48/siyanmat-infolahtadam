import { useState } from "react";

export function useFileUpload(defaultImageUrl: string) {
  const [file, setFile] = useState<string>(defaultImageUrl);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("image", file);

    try {
      const response = await fetch("/api/upload/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Something went wrong. Please try again later.");
      }

      const data = await response.json();
      setFile(data.imageUrl);
    } catch (error) {
      console.error(error);
    }

    e.target.type = "text";
    e.target.type = "file";
  };

  return { file, handleFileChange };
}
