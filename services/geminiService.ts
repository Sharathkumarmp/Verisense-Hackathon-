import { VerificationStatus } from "../types";

const N8N_WEBHOOK_URL = "https://mpskumar.app.n8n.cloud/webhook/verify";

interface VerificationResult {
  status: VerificationStatus;
  explanation: string;
  confidence: number;
  source?: string;
  rawResponse: any;
}

export const verifyClaimWithGemini = async (
  claimText: string,
  location: string,
  source: string,
  evidenceFile?: File | null
): Promise<VerificationResult> => {
  
  let rawText = "";

  try {
    let response: Response;

    if (evidenceFile) {
      // Scenario B: Media Upload
      const formData = new FormData();
      formData.append('data', evidenceFile);
      // Send claim text if available, otherwise default instruction
      formData.append('claim', claimText || "Analyze this file");
      
      response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });
    } else {
      // Scenario A: Text Verification
      response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ claim: claimText }),
      });
    }

    // 1. Get raw text first
    rawText = await response.text();
    console.log("🕵️‍♂️ Raw N8N Response Body:", rawText);

    if (!response.ok) {
      throw new Error(`Verification service error: ${response.status} ${response.statusText} - ${rawText.substring(0, 100)}`);
    }

    let data: any;
    try {
        // 2. Try strict parsing first
        data = JSON.parse(rawText);
    } catch (e) {
        console.warn("Direct JSON parse failed, attempting robust extraction...", e);
        
        // 3. Robust Parsing with Backward Search
        // We search for the first '{', then iterate backwards from the last '}'
        // to find the substring that parses as valid JSON.
        // This handles cases where trailing garbage contains '}' (like HTML/CSS/Logs).
        
        const firstBrace = rawText.indexOf('{');
        if (firstBrace === -1) {
             throw new Error("No JSON object found in response (no opening brace).");
        }

        let parsed = false;
        let lastBrace = rawText.lastIndexOf('}');
        
        while (lastBrace > firstBrace) {
            const potentialJson = rawText.substring(firstBrace, lastBrace + 1);
            try {
                data = JSON.parse(potentialJson);
                parsed = true;
                console.log(`✅ Robust parsing succeeded at index ${lastBrace}`);
                break; 
            } catch (jsonError) {
                // Try previous closing brace
                lastBrace = rawText.lastIndexOf('}', lastBrace - 1);
            }
        }

        if (!parsed) {
            throw new Error(`Robust parsing failed. Could not extract valid JSON. Raw start: ${rawText.substring(0, 50)}...`);
        }
    }

    console.log("✅ Parsed Data:", data);

    // Map status (Display as a colored badge)
    let status = VerificationStatus.Pending;
    // Safely access status, default to empty string if missing
    const rawStatus = String(data.status || '').toLowerCase();
    
    if (rawStatus.includes('verified') || rawStatus.includes('true')) {
        status = VerificationStatus.Verified;
    } else if (rawStatus.includes('false') || rawStatus.includes('fake')) {
        status = VerificationStatus.False;
    } else if (rawStatus.includes('misleading')) {
        status = VerificationStatus.Misleading;
    }

    // Construct explanation using specific keys requested
    let explanationParts: string[] = [];

    // Helper to get value with fallback
    const getVal = (key: string) => data[key] ? String(data[key]) : null;

    const truthEnglish = getVal('truth_english');
    const debunkNative = getVal('debunk_native');
    const verificationLog = getVal('verification_log');
    const transcript = getVal('transcript');
    const imageAnalysis = getVal('image_analysis');

    if (truthEnglish) explanationParts.push(`🇬🇧 ${truthEnglish}`);
    if (debunkNative) explanationParts.push(`🇮🇳 ${debunkNative}`);
    
    // If we have specific analysis for media, add it
    if (transcript) explanationParts.push(`📝 Transcript: ${transcript}`);
    if (imageAnalysis) explanationParts.push(`🖼️ Image Analysis: ${imageAnalysis}`);

    let explanation = explanationParts.join('\n\n');
    
    // Fallback to verification_log if explanation is empty, or a generic message
    if (!explanation.trim()) {
        explanation = verificationLog || "Analysis complete (No details provided).";
    }

    return {
      status,
      explanation: explanation.trim(),
      confidence: 0.95, // N8N doesn't return confidence score, default to high
      source: getVal('source_url') || undefined,
      rawResponse: {
        statusCode: response.status,
        rawBody: rawText,
        parsedJson: data
      }
    };

  } catch (error) {
    console.error("Verification failed:", error);
    // Include the raw text in the error message for the UI debug view
    if (error instanceof Error) {
        // Avoid duplicating if already added
        if (!error.message.includes("Raw Response:")) {
             error.message += `\n\nRaw Response: ${rawText ? rawText.substring(0, 500) : "Empty"}`;
        }
    }
    throw error;
  }
};