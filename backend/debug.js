const fs = require('fs');
const path = require('path');

console.log("📂 Current Directory:", __dirname);

const modelsPath = path.join(__dirname, 'models');

if (fs.existsSync(modelsPath)) {
    console.log("✅ 'models' folder found!");
    
    // List all files inside 'models'
    const files = fs.readdirSync(modelsPath);
    console.log("📄 Files inside 'models':", files);
    
    // Check specifically for Log.js
    if (files.includes('Log.js')) {
        console.log("🎉 Log.js exists!");
    } else {
        console.log("❌ Log.js is MISSING inside the list above.");
        console.log("   (Check for typos like 'log.js' or 'Log.js.txt')");
    }
} else {
    console.log("❌ 'models' folder NOT found. Did you name it 'model'?");
}