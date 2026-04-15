const DEFAULT_FILE_KEY = "y3zmw15iLpdpYwLKSMCpP9";

export interface FigmaEnv {
  accessToken: string;
  fileKey: string;
}

export function requireFigmaEnv(): FigmaEnv {
  const accessToken = process.env.FIGMA_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error(
      "FIGMA_ACCESS_TOKEN no esta definido. Generalo en Figma Settings -> Security y ponelo en tu .env."
    );
  }

  const fileKey = process.env.FIGMA_FILE_KEY ?? DEFAULT_FILE_KEY;
  return { accessToken, fileKey };
}
