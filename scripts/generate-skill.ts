import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { buildPdfVectorApiSkillMarkdown } from "@pdfvector/api-docs";

const root = join(import.meta.dirname, "..");
const checkOnly = process.argv.includes("--check");
const skillPath = "skills/pdfvector-api/SKILL.md";
const target = join(root, skillPath);
const content = `${buildPdfVectorApiSkillMarkdown().trim()}\n`;

const current = await readFile(target, "utf8").catch((error: unknown) => {
	if (
		typeof error === "object" &&
		error !== null &&
		"code" in error &&
		error.code === "ENOENT"
	) {
		return "";
	}
	throw error;
});

if (current !== content) {
	if (checkOnly) {
		console.error(`${skillPath} is out of date. Run bun run generate.`);
		process.exit(1);
	}
	await mkdir(dirname(target), { recursive: true });
	await writeFile(target, content);
	console.log(`Updated ${skillPath}`);
}
