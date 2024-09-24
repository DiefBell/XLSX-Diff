#!/usr/bin/env node
import { diff } from "../lib";
import { resolve } from "node:path";
import { _xlsxToJson } from "../lib/diff";

// basic stuff for diffing changes to one unstaged file
const [
	executable,
	script,

	oldFilePath,
	cachedOldFilePath,

	oldBlobHash,
	oldFileMode,

	newFilePath,
	newBlobHash,
	newFileMode
] = process.argv;

diff({
	oldFileName: oldFilePath,
	oldFilePath: resolve(cachedOldFilePath),

	newFileName: newFilePath,
	newFilePath: resolve(newFilePath),
});
