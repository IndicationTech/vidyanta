import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = join(__dirname, "pages", "Academics.jsx");

const content = fs.readFileSync(filePath, "utf8");
const startIndex = content.indexOf("          {/* Timetable Grid */}");
const timetableSection = content.slice(
  startIndex,
  content.indexOf("        </div>", startIndex) + 10,
);

console.log(timetableSection);
