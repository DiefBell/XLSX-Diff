import * as fs from "node:fs";
import {
	readFile as readXlsxFile,
	utils as xlsxUtils,
	type WorkBook
} from "xlsx";

export const textconv = (filePath: string): void =>
{
	if(!fs.existsSync(filePath)) {
		console.error(`Attempted to textconv file "${filePath}" but it does not exist.`);
		process.exit(1);
	}

	let workbook: WorkBook;
	try
	{
		workbook = readXlsxFile(filePath);
	}
	catch
	{
		console.error(
			`Attempted to textconv file "${filePath}" but it failed to open. Is it a valid .xlsx file?`
		);
		process.exit(1);
	}

	workbook.SheetNames.forEach((sheetName) => {
		// TODO: Need some way of deciding if it has headers?
		// TODO: Also should factor in if the headers are for rows
		const sheetJson: string[][] = xlsxUtils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
		console.log(`Sheet: ${sheetName}`);
		console.table(sheetJson);
	});
}
