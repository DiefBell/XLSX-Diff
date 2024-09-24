import * as fs from "node:fs";
import { readFile as readXlsxFile, utils } from "xlsx";
import { createPatch, createTwoFilesPatch } from "diff";
import * as path from "node:path";

type UnstagedChangedMetadata = {
	oldFileName: string,
	oldFilePath: string,

	newFileName: string,
	newFilePath: string,
}

type XLSXSheetRow = (string | number)[];
type XLSXContent = { [sheetName: string]: XLSXSheetRow[] }

export const _xlsxToJson = (filePath: string): XLSXContent =>
{
	if(!fs.existsSync(filePath)) {
		// going to assume for now that it exists,
		// readXlsxFile will handle throwing if it doesn't.
	}

	const workbook = readXlsxFile(filePath);
	const jsonOutput: XLSXContent = {};

	workbook.SheetNames.forEach(
		(sheetName) =>
		{
			const sheet = utils.sheet_to_json<XLSXSheetRow>(
				workbook.Sheets[sheetName], {
					blankrows: true,
					header: 1
				}
			);
			jsonOutput[sheetName] = sheet;
		}
	);

	return jsonOutput;
}

type UnifiedDiffFormat = string;

export const _diffJsonAndColour = (
	jsonOld: string,
	jsonNew: string,
	oldFileName: string,
	newFileName?: string
): UnifiedDiffFormat =>
{
	const diff: UnifiedDiffFormat = !!newFileName
	? createTwoFilesPatch(
		oldFileName,
		newFileName,
		jsonOld,
		jsonNew
	)
	: createPatch(
		oldFileName,
		jsonOld,
		jsonNew
	);

	const coloured: UnifiedDiffFormat = diff
		.split("\n")
		.map(
			(line): string =>
			{
				if(line.startsWith("+"))
				{
					return `\x1b[32m${line}\x1b[0m`
				}
				if(line.startsWith("-"))
				{
					return `\x1b[31m${line}\x1b[0m`
				}
				if(line.startsWith("@@") && line.endsWith("@@"))
				{
					return `\x1b[36m${line}\x1b[0m`
				}
				return line;
			}
		)
		.join("\n");
	
	return coloured;
}

export const diff = (diffMetadata: UnstagedChangedMetadata): void =>
{
	const {
		oldFileName,
		oldFilePath,
		newFileName,
		newFilePath
	} = diffMetadata;

	const renamed = oldFileName !== newFileName;

	const whatDiffText = renamed ? `${newFileName} against ${oldFileName}` : `${oldFileName}`;
	if(!fs.existsSync(oldFilePath))
	{
		console.error(`Attempted to diff ${whatDiffText} but could not find file at "${oldFilePath}".`);
		process.exit(1);
	}

	if(!fs.existsSync(newFilePath))
	{
		console.error(`Attempted to diff ${whatDiffText} but could not find file at "${newFilePath}".`);
		process.exit(1);
	}

	const jsonOld = _xlsxToJson(oldFilePath);
	const jsonNew = _xlsxToJson(newFilePath);
	const strOld = JSON.stringify(jsonOld, undefined, 2);
	const strNew = JSON.stringify(jsonNew, undefined, 2);
	
	const unifiedDiff = _diffJsonAndColour(strOld, strNew, oldFileName, newFileName);
	console.log(unifiedDiff);
}