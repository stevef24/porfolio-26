/**
 * Extract transcripts from YouTube videos for the Claude Code Fundamentals course.
 *
 * Usage:
 *   npx tsx scripts/extract-transcripts.ts
 *
 * This script extracts transcripts from the Net Ninja Claude Code playlist
 * and saves them as JSON files for course content creation.
 */

import { YoutubeTranscript } from "youtube-transcript-plus";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

interface VideoInfo {
	id: string;
	title: string;
	slug: string;
	duration: string;
	module: string;
}

// Net Ninja Claude Code playlist videos
// Video IDs extracted from: https://www.youtube.com/playlist?list=PL4cUxeGkcC9g4YJeBqChhFJwKQ9TRiivY
const videos: VideoInfo[] = [
	{
		id: "SUysp3sJHbA",
		title: "Introduction & Setup",
		slug: "01-introduction-setup",
		duration: "10:11",
		module: "Getting Started",
	},
	{
		id: "i_OHQH4-M2Y",
		title: "CLAUDE.md Files & /init",
		slug: "02-claude-md-init",
		duration: "12:18",
		module: "Getting Started",
	},
	{
		id: "ob-mYGqqFQw",
		title: "Context",
		slug: "03-understanding-context",
		duration: "13:03",
		module: "Core Concepts",
	},
	{
		id: "TU0ZcDFq0e0",
		title: "Tools & Permissions",
		slug: "04-tools-permissions",
		duration: "4:55",
		module: "Core Concepts",
	},
	{
		id: "MTGJuu9CeMk",
		title: "Planning & Thinking",
		slug: "05-planning-thinking",
		duration: "11:11",
		module: "Core Concepts",
	},
	{
		id: "52KBhQqqHuc",
		title: "Slash Commands",
		slug: "06-slash-commands",
		duration: "12:10",
		module: "Power Features",
	},
	{
		id: "X7lgIa6guKg",
		title: "MCP Servers",
		slug: "07-mcp-servers",
		duration: "13:51",
		module: "Power Features",
	},
	{
		id: "Phr7vBx9yFQ",
		title: "Subagents",
		slug: "08-subagents",
		duration: "10:55",
		module: "Power Features",
	},
	{
		id: "7pKN_pjPW04",
		title: "Claude Code with GitHub",
		slug: "09-github-integration",
		duration: "5:47",
		module: "Integration & Best Practices",
	},
	{
		id: "cCHPjvswTpQ",
		title: "Final Thoughts & Tips",
		slug: "10-tips-best-practices",
		duration: "6:16",
		module: "Integration & Best Practices",
	},
];

const OUTPUT_DIR = "content/courses/claude-code-fundamentals/transcripts";

interface TranscriptSegment {
	text: string;
	offset: number;
	duration: number;
}

async function extractTranscript(
	video: VideoInfo
): Promise<TranscriptSegment[] | null> {
	if (!video.id) {
		console.log(`⏭️  Skipping "${video.title}" - no video ID`);
		return null;
	}

	try {
		console.log(`📝 Extracting: ${video.title}...`);
		const transcript = await YoutubeTranscript.fetchTranscript(video.id);

		// Format transcript segments
		return transcript.map((segment) => ({
			text: segment.text,
			offset: segment.offset,
			duration: segment.duration,
		}));
	} catch (error) {
		console.error(`❌ Failed to extract "${video.title}":`, error);
		return null;
	}
}

async function saveTranscript(
	video: VideoInfo,
	transcript: TranscriptSegment[]
): Promise<void> {
	const outputPath = join(OUTPUT_DIR, `${video.slug}.json`);

	const data = {
		videoId: video.id,
		title: video.title,
		duration: video.duration,
		module: video.module,
		extractedAt: new Date().toISOString(),
		segments: transcript,
		// Join all text for easy reading
		fullText: transcript.map((s) => s.text).join(" "),
	};

	await writeFile(outputPath, JSON.stringify(data, null, 2));
	console.log(`✅ Saved: ${outputPath}`);
}

async function main(): Promise<void> {
	console.log("🎬 Claude Code Fundamentals - Transcript Extraction\n");

	// Ensure output directory exists
	await mkdir(OUTPUT_DIR, { recursive: true });

	// Check if we have any video IDs
	const videosWithIds = videos.filter((v) => v.id);

	if (videosWithIds.length === 0) {
		console.log("⚠️  No video IDs found!");
		console.log("\nNext steps:");
		console.log(
			"1. Use browser automation to extract video IDs from the playlist"
		);
		console.log(
			"2. Update the 'videos' array in this script with the extracted IDs"
		);
		console.log("3. Re-run this script");
		console.log("\nPlaylist URL:");
		console.log(
			"https://www.youtube.com/playlist?list=PL4cUxeGkcC9j0oCCVR_F39-n1C22txNOq"
		);
		return;
	}

	let successCount = 0;

	for (const video of videos) {
		const transcript = await extractTranscript(video);

		if (transcript) {
			await saveTranscript(video, transcript);
			successCount++;
		}

		// Rate limiting - be respectful to YouTube
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}

	console.log(`\n📊 Extraction complete: ${successCount}/${videos.length} videos`);
}

main().catch(console.error);
