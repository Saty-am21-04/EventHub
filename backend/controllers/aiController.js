const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

// Initialize Gemini
// Make sure GEMINI_API_KEY is in your .env file!
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const smartRegister = async (req, res) => {
  try {
    // 1. Check if file exists
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided." });
    }

    console.log("📸 Processing image:", req.file.path);

    // 2. Prepare image for Gemini
    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = imageBuffer.toString("base64");

    // ✅ CORRECT MODEL: gemini-2.5-computer-use-preview-10-2025
    const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });

    // 3. The Prompt
    const prompt = `
      Analyze this ID card image and extract:
      - Name (Full Name)
      - Email (Infer from name + '@college.edu.in' if not visible)
      - Age (Calculate from DOB if visible, otherwise estimate based on photo. Default to 20 if unsure.)
      
      Return ONLY a raw JSON object with this structure:
      { "name": "string", "email": "string", "age": number }
    `;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Image, mimeType: req.file.mimetype } },
    ]);

    const response = await result.response;
    let text = response.text();
    
    console.log("🤖 Gemini Raw Output:", text); // Debugging log

    // 4. ✨ CLEANUP STEP (Crucial for avoiding 500 Errors) ✨
    // Removes ```json and ``` markdown wrappers if Gemini adds them
    const cleanJson = text.replace(/```json|```/g, "").trim();
    
    let extractedData;
    try {
        extractedData = JSON.parse(cleanJson);
    } catch (parseError) {
        console.error("JSON Parse Failed. Raw text was:", cleanJson);
        throw new Error("AI returned invalid JSON format");
    }
    
    // 5. Cleanup the uploaded file
    if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
    }

    // 6. Send success response
    res.json(extractedData);

  } catch (error) {
    console.error("❌ Smart Register Error:", error);
    
    // Attempt to clean up file even if error occurred
    if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ message: "Failed to process image. Check backend logs." });
  }
};

module.exports = { smartRegister };