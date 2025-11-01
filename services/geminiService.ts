import { GoogleGenAI, Type } from "@google/genai";
import { Analysis } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const transformModel = 'gemini-2.5-flash';
const analysisModel = 'gemini-2.5-flash';

const TRANSFORMATION_DETAILS: Record<string, string> = {
  'Performance Boost': `
- **Performance Boost:** Prioritize algorithmic efficiency (e.g., using maps for O(1) lookups). In React, apply memoization (\`React.memo\`, \`useMemo\`, \`useCallback\`) to prevent needless re-renders. Implement lazy loading for components and assets where appropriate. Optimize loops and data processing tasks.`,
  'Security Hardening': `
- **Security Hardening:** Sanitize all user-provided data to prevent XSS attacks. Use parameterized queries or ORMs to eliminate SQL injection risks. Implement proper validation on both client and server sides. Check for insecure direct object references. Do not expose sensitive data in error messages.`,
  'Accessibility': `
- **Accessibility:** Ensure the code adheres to WCAG 2.1 AA standards. Add appropriate ARIA attributes to components. All interactive elements must be keyboard accessible and have visible focus states. Use semantic HTML. Ensure text has sufficient color contrast.`,
  'Mobile-First': `
- **Mobile-First:** Refactor styles to be mobile-first. Use responsive units and CSS grid/flexbox for fluid layouts. Ensure touch targets are adequately sized (at least 44x44px). Optimize images for various screen sizes.`,
  'Modern Stack': `
- **Modern Stack:** Update code to use modern language features (e.g., ES6+ in JavaScript like async/await, let/const, arrow functions). In React, refactor class components to functional components with Hooks where it makes sense. Replace deprecated library methods with their modern equivalents.`,
  'Best Practices': `
- **Best Practices:** Focus on code readability and maintainability. Decompose large functions into smaller, pure functions with single responsibilities. Use descriptive variable and function names. Remove commented-out or dead code. Ensure consistent code formatting.`,
};

const getSystemInstruction = (transformations: string[]): string => {
  const baseInstruction = `You are CodeMorph AI, an expert software engineer specializing in code analysis and transformation. Your goal is to rewrite the user's code based on their selected optimization goals. You must follow these rules strictly:
1. Maintain Original Functionality: The transformed code must behave identically to the original.
2. Minimal Necessary Changes: Only modify the code to meet the specified goals. Do not refactor unrelated parts.
3. Inline Comments: Add concise comments starting with \`// CodeMorph AI:\` (for JS/TS/Go/Java) or \`# CodeMorph AI:\` (for Python) to explain significant changes.
4. Modern Best Practices: Ensure the final code adheres to modern standards for the given language.
5. Output Format: Respond ONLY with the complete, transformed code block. Do not include any explanatory text, greetings, or markdown fences before or after the code.

Based on the user's selected goals, apply the following specific transformations:`;

  const details = transformations
    .map(t => TRANSFORMATION_DETAILS[t] || '')
    .join('');

  return `${baseInstruction}\n${details}`;
};


export const transformCode = async (
  inputCode: string,
  transformations: string[],
  language: string
): Promise<string> => {
  const systemInstruction = getSystemInstruction(transformations);

  const userPrompt = `Language: ${language}. Transformation Goals: ${transformations.join(', ')}.
Please transform the following code:
\`\`\`${language}
${inputCode}
\`\`\``;

  try {
    const response = await ai.models.generateContent({
      model: transformModel,
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3,
      },
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error transforming code:", error);
    throw new Error("Failed to transform code with AI. Please try again.");
  }
};


export const generateAnalysis = async (
  originalCode: string,
  transformedCode: string,
  language: string
): Promise<Analysis> => {
  const userPrompt = `Analyze the differences between the original and transformed code. Provide a summary of improvements.
Original Code (${language}):
\`\`\`${language}
${originalCode}
\`\`\`

Transformed Code (${language}):
\`\`\`${language}
${transformedCode}
\`\`\`

Based on the changes, provide an educated estimate for the stats. The quality grade should be based on the improvements.
`;

  try {
    const response = await ai.models.generateContent({
        model: analysisModel,
        contents: userPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    summaryStats: {
                        type: Type.OBJECT,
                        properties: {
                            performance: { type: Type.OBJECT, properties: { value: {type: Type.STRING}, description: {type: Type.STRING} } },
                            issuesFixed: { type: Type.OBJECT, properties: { value: {type: Type.STRING}, description: {type: Type.STRING} } },
                            bundleSize: { type: Type.OBJECT, properties: { value: {type: Type.STRING}, description: {type: Type.STRING} } },
                            qualityGrade: { type: Type.OBJECT, properties: { value: {type: Type.STRING}, description: {type: Type.STRING} } }
                        }
                    },
                    detailedChanges: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                icon: { type: Type.STRING },
                                description: { type: Type.STRING }
                            }
                        }
                    },
                    explanation: { type: Type.STRING }
                }
            },
            temperature: 0.5,
        }
    });

    const jsonString = response.text.trim();
    const parsedJson = JSON.parse(jsonString);
    return parsedJson as Analysis;
  } catch (error) {
    console.error("Error generating analysis:", error);
    // Return a default error analysis object
    return {
      summaryStats: {
        performance: { value: "N/A", description: "Performance" },
        issuesFixed: { value: "N/A", description: "Issues Fixed" },
        bundleSize: { value: "N/A", description: "Bundle Size" },
        qualityGrade: { value: "N/A", description: "Code Quality" }
      },
      detailedChanges: [{ icon: "❌", description: "Failed to generate AI analysis." }],
      explanation: "Could not generate an explanation due to an API error. Please check the transformed code manually."
    };
  }
};