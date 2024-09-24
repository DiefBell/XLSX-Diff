#!/usr/bin/env node
import { diff } from "../lib";
import { resolve } from "node:path";

// basic stuff for diffing changes to one unstaged file
const [
	executable,
	script,

	oldFilePath,
	tmpNewFilePath,

	oldBlobHash,
	oldFileMode,

	newFilePath,
	newBlobHash,
	newFileMode
] = process.argv;

diff({
	oldFileName: oldFilePath,
	oldFilePath: resolve(oldFilePath),

	newFileName: newFilePath,
	newFilePath: resolve(newFilePath),
	tmpNewFilePath, // should already be absolute

});
