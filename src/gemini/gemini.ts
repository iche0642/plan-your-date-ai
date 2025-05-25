import { GoogleGenAI, Type } from "@google/genai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const askGemini = async (activity: string) => {
  const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  try {
    const content = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Give me 5 alternatives for ${activity}, with same type, taking into account its location, price and time`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              time: {
                type: Type.STRING,
                description: "start time of activity",
                nullable: false,
              },
              duration: {
                type: Type.STRING,
                description: "total duration of activity",
                nullable: false,
              },

              title: {
                type: Type.STRING,
                description: "title of activity",
                nullable: false,
              },
              type: {
                type: Type.STRING,
                description: "type of the activity",
                nullable: false,
              },
              location: {
                type: Type.STRING,
                description: "location of activity",
                nullable: false,
              },
              description: {
                type: Type.STRING,
                description: "description of the activity",
                nullable: false,
              },
              price: {
                type: Type.STRING,
                description: "price of the activity",
                nullable: false,
              },
              rating: {
                type: Type.STRING,
                description: "rating of the activity",
                nullable: false,
              },
            },
            required: [
              "time",
              "duration",
              "title",
              "type",
              "location",
              "description",
              "price",
              "rating",
            ],
          },
        },
      },
    });
    const result = extractFromJson(content.text ?? "");
    return result;
  } catch (error) {
    console.log("Something Went Wrong", error);
    return [];
  }
};

export function extractFromJson(jsonString: string) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) {
      throw new Error("Input JSON is not an array.");
    }
    return parsed.map((item) => ({
        time: item.time,
        duration: item.duration,
        title: item.title,
        type: item.type,
        location: item.location,
        description: item.description,
        price: item.price,
        rating: item.rating,
    }));
  } catch (error) {
    console.error("Invalid JSON input:", error);
    return [];
  }
}
