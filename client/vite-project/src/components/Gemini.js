// geminiImageAnalyzer.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// ⚠️ Use your own Gemini API Key (Not for production!)
const genAI = new GoogleGenerativeAI("AIzaSyA3GrV94CRxUc9uEY2cvaFxEGQuCAFIygo");

async function getImageBase64(url) {
  const response = await fetch(url);
  const contentType = response.headers.get("content-type") || "image/jpeg";
  const arrayBuffer = await response.arrayBuffer();

  const base64 = btoa(
    new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
  );

  return { base64, mimeType: contentType };
}

export async function Gemini(imageUrl) {
  try {
    const { base64, mimeType } = await getImageBase64('https://tse3.mm.bing.net/th/id/OIP.gYhR6V9EQyJ6VFhNsOY8nwHaE8?pid=Api&P=0&h=180');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text:
                "Carefully analyze the image and describe the situation as if you are a local resident who is personally facing the issue shown. Identify any civic or infrastructure-related problems such as garbage accumulation, potholes, waterlogging, broken roads, or other public hazards.Write the description in bullet points, covering the following:What the issue is,What its current condition looks like,How it is affecting your daily life as a residen,Its impact on public safety, cleanliness, health, or accessibility,the description should write as 'we are facing it issue like that'"
            },
            {
              inlineData: {
                mimeType,
                data: base64,
              },
            },
          ],
        },
      ],
    });
    // console.log("Desc ==>>> ",result.response.text())
    return result.response.text();
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    throw new Error("Failed to analyze image.");
  }
}
