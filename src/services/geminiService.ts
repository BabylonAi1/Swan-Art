import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ScannedOrderData {
  orderNumber?: string;
  customerName?: string;
  customerPhone?: string;
  address?: string;
  canvasSizeDetails?: string;
  totalPrice?: number;
  downPayment?: number;
  canvasCount?: string;
  frameType?: string;
  instagramLink?: string;
}

export async function scanOrderScreenshot(base64Image: string): Promise<ScannedOrderData> {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          {
            text: `Extract order details from this screenshot of a chat or order form. 
            Look specifically for:
            - Order Number: Usually starts with # (e.g., #5001). Extract just the number or the full code.
            - Customer Name: The full name of the buyer.
            - Customer Phone: Iraqi phone numbers (e.g., 07xxxxxxxx).
            - Address: The delivery address.
            - Canvas Size Details: Dimensions like 60x90 or descriptions of sizes.
            - Total Price: The full amount in IQD.
            - Down Payment (العربون): The amount paid upfront.
            - Canvas Count: Number of pieces.
            - Frame Type: Look for words like "إطار" followed by a code (e.g., إطار J3, إطار 6, إطار مودرن). Extract the code/type.
            - Instagram Link: Any link starting with instagram.com.
            
            Return the data in JSON format.`
          },
          {
            inlineData: {
              mimeType: "image/png",
              data: base64Image.split(',')[1]
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          orderNumber: { type: Type.STRING },
          customerName: { type: Type.STRING },
          customerPhone: { type: Type.STRING },
          address: { type: Type.STRING },
          canvasSizeDetails: { type: Type.STRING },
          totalPrice: { type: Type.NUMBER },
          downPayment: { type: Type.NUMBER },
          canvasCount: { type: Type.STRING },
          frameType: { type: Type.STRING },
          instagramLink: { type: Type.STRING },
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return {};
  }
}
