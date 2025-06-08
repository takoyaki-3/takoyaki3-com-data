import { readdir, readFile, writeFile } from 'fs/promises';
import { join, parse } from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- Configuration ---
const SRC_DIR = 'src';
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const MAX_RETRIES = 3; // Number of retries for API calls
const RETRY_DELAY = 1000; // Delay between retries in ms
// --- End Configuration ---

if (!GOOGLE_API_KEY) {
  console.error('Error: GOOGLE_API_KEY environment variable is not set.');
  process.exit(1);
}

// Initialize Gemini Client
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }); // Or your preferred model

// Helper function for retrying API calls
async function retry(fn, retries = MAX_RETRIES, delay = RETRY_DELAY) {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      console.warn(`API call failed, retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retry(fn, retries - 1, delay * 2); // Exponential backoff
    } else {
      console.error('API call failed after multiple retries.');
      throw error; // Re-throw the error after exhausting retries
    }
  }
}

// Function to generate description using Gemini
async function generateDescription(markdownContent) {
  const prompt = `以下のマークダウンの内容を日本語で100文字程度のdescription用に要約してください:\n\n${markdownContent}`;
  console.log(`Generating description...`);

  const generationConfig = {
    temperature: 0.7, // Adjust creativity/determinism
    topK: 1,
    topP: 1,
    maxOutputTokens: 200, // Allow slightly more than 100 chars for flexibility
  };

  try {
    const result = await retry(async () => {
        const generationResult = await model.generateContent(prompt, generationConfig);
        return generationResult.response;
    });
    const text = result.text();
    console.log(`Generated description: ${text.substring(0, 50)}...`); // Log truncated description
    return text.trim();
  } catch (error) {
    console.error('Error generating description with Gemini:', error);
    return null; // Return null on error
  }
}

// Main function to process files
async function processFiles() {
  try {
    const files = await readdir(SRC_DIR);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    console.log(`Found ${jsonFiles.length} JSON files in ${SRC_DIR}.`);

    for (const jsonFile of jsonFiles) {
      const jsonFilePath = join(SRC_DIR, jsonFile);
      const baseName = parse(jsonFile).name;
      const mdFilePath = join(SRC_DIR, `${baseName}.md`);

      console.log(`\nProcessing ${jsonFile}...`);

      try {
        const jsonContentStr = await readFile(jsonFilePath, 'utf-8');
        const jsonData = JSON.parse(jsonContentStr);

        if (jsonData.description && jsonData.description.trim() !== '') {
          console.log(`  - Skipping: Description already exists.`);
          continue;
        }

        console.log(`  - Description missing. Reading ${baseName}.md...`);
        let mdContent;
        try {
          mdContent = await readFile(mdFilePath, 'utf-8');
        } catch (mdError) {
          if (mdError.code === 'ENOENT') {
            console.warn(`  - Warning: Corresponding Markdown file not found: ${mdFilePath}. Skipping.`);
            continue; // Skip if MD file doesn't exist
          } else {
            throw mdError; // Re-throw other MD read errors
          }
        }

        if (!mdContent || mdContent.trim() === '') {
            console.warn(`  - Warning: Markdown file is empty: ${mdFilePath}. Skipping.`);
            continue; // Skip if MD file is empty
        }

        const description = await generateDescription(mdContent);

        if (description) {
          jsonData.description = description;
          await writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2));
          console.log(`  - Success: Updated ${jsonFile} with generated description.`);
        } else {
          console.error(`  - Failed: Could not generate description for ${jsonFile}.`);
        }

      } catch (error) {
        console.error(`  - Error processing ${jsonFile}: ${error.message}`);
        if (error instanceof SyntaxError) {
            console.error(`  - Check if ${jsonFile} is valid JSON.`);
        }
        // Continue to the next file even if one fails
      }
       // Add a small delay to avoid hitting API rate limits too quickly
       await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('\nProcessing complete.');

  } catch (err) {
    console.error(`Error reading directory or processing files: ${err.message}`);
    process.exit(1);
  }
}

// Run the script
processFiles();
