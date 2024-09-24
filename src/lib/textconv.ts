import * as fs from "node:fs";
import {
	readFile as readXlsxFile,
	utils as xlsxUtils,
	type WorkBook
} from "xlsx";

const headersAndRowsToTableObject = (
	headers: string[],
	rows: string[][]
): Record<string, string>[] =>
{
	return rows.map(
		(row) => {
			const obj: Record<string, string> = {};
			headers.forEach(
				(header, index) => {
					obj[header] = row[index]
				}
			);
			return obj;
		}
	);
}

export const textconv = (filePath: string) =>
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
		const [headers, ...rows] = sheetJson;

		const data = headersAndRowsToTableObject(headers, rows);

		console.log(`Sheet: ${sheetName}`);
		console.table(data);
	});
}
