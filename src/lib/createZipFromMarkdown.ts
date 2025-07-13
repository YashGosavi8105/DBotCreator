import JSZip from "jszip";
import { saveAs } from "file-saver";

export const createZipFromMarkdown = async (markdown: string) => {
  const zip = new JSZip();
  const lines = markdown.split("\n");

  let currentFile = "";
  let isInCodeBlock = false;
  let fileContent: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Detect file header
    const match = line.match(/^##\s+(.+\.\w+)/);
    if (match) {
      // Save previous file if we have content
      if (currentFile && fileContent.length) {
        zip.file(currentFile, fileContent.join("\n"));
        fileContent = [];
      }
      currentFile = match[1];
      isInCodeBlock = false;
      continue;
    }

    // Start of code block
    if (line.startsWith("```")) {
      isInCodeBlock = !isInCodeBlock;
      continue;
    }

    if (isInCodeBlock && currentFile) {
      fileContent.push(lines[i]);
    }
  }

  // Final file
  if (currentFile && fileContent.length) {
    zip.file(currentFile, fileContent.join("\n"));
  }

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, "discord-bot-files.zip");
};

