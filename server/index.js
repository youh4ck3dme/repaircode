require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 4000;
const sandboxRoutes = require('./routes/sandbox');
const sandboxProxy = require('./routes/sandbox.proxy');

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/api/sandbox', sandboxRoutes);
app.use('/api/proxy', sandboxProxy);

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "API_KEY_MISSING");

// Models
const getModel = (instruction) => {
  return genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: instruction,
  });
};

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'repaircode-api' });
});

app.post('/api/pipeline', async (req, res) => {
  try {
    const { files, stage } = req.body;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "API_KEY_MISSING") {
      // Fallback for simulation if no key provided
      return res.json({
        simulation: true,
        message: "API Key missing, running in simulation mode."
      });
    }

    let responseText = "";

    if (stage === 'analyzer') {
      const model = getModel("You are a code auditor. Analyze the provided file structure and content. Output a JSON object with 'critical', 'high', 'medium', 'low' file lists and a 'summary'.");
      const result = await model.generateContent(`Analyze these files: ${JSON.stringify(files)}`);
      responseText = result.response.text();
    } else if (stage === 'factory') {
      const model = getModel("You are a code refactoring expert. Refactor the provided code to be modern, secure, and performant. Output the refactored code.");
      const result = await model.generateContent(`Refactor: ${JSON.stringify(files)}`);
      responseText = result.response.text();
    } else if (stage === 'polisher') {
      const model = getModel("You are a code stylist. Add JSDoc, fix formatting, and ensure code quality. Output the polished code.");
      const result = await model.generateContent(`Polish: ${JSON.stringify(files)}`);
      responseText = result.response.text();
    }

    res.json({
      success: true,
      data: responseText
    });

  } catch (error) {
    console.error("Pipeline Error:", error);
    res.status(500).json({ error: error.message });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
