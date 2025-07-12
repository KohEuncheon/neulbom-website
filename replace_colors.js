const fs = require("fs");
const path = require("path");

const files = [
  "client/pages/Reservation.tsx",
  "client/pages/AdminIndex.tsx",
  "client/pages/MCDetail.tsx",
  "client/pages/MCs.tsx",
  "client/pages/Promotion.tsx",
  "client/pages/Guidance.tsx",
  "client/components/website/Footer.tsx",
];

files.forEach((file) => {
  try {
    let content = fs.readFileSync(file, "utf8");

    // Replace pink-500 with pink-400, pink-600 with pink-500
    content = content.replace(/bg-pink-500/g, "bg-pink-400");
    content = content.replace(/hover:bg-pink-600/g, "hover:bg-pink-500");
    content = content.replace(/text-pink-600/g, "text-pink-500");
    content = content.replace(/border-pink-500/g, "border-pink-400");
    content = content.replace(/focus:ring-pink-500/g, "focus:ring-pink-400");
    content = content.replace(/hover:text-pink-500/g, "hover:text-pink-400");
    content = content.replace(/#ff6b9d/g, "#f472b6");

    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  } catch (error) {
    console.log(`Error processing ${file}:`, error.message);
  }
});
