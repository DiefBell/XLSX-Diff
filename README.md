<center>

# xlsx-diff

### Custom git diff driver for Microsoft Excel .XLSX files

</center>

## Features
- Git will be better able to calcuate how many changes have been made to your XLSX file.
- Your IDE can display a basic text representation of the file and diff it for you. **NOTE THAT IN VSCODE, IT ONLY WORKS IF YOU'VE STAGED THE FILE! (untested on other IDEs)**

## Requirements
- NodeJS (tested on 14+)

## Setup
1. Download this package with your preferred package manager: `npm install --dev xlsx-diff`.
2. Tell git that this driver exists:
	- Local:
		- `git config --local diff.xlsx.command "npm xlsx-diff"`
		- `git config --local diff.xlsx.textconv "npm xlsx-textconv"`
	- Global:
		- Add to your `.gitconfig` file in your home directory:
			```INI
			[diff "xlsx"]
				command = "npm xlsx-diff"
				textconv = "npm xlsx-textconv"
			```
3. Configure your repository to use this diff driver for XLSX files:
	1. Create a `.gitattributes` file in the root of your repository.
	2. Add the line `*.xlsx diff=xlsx`.
	3. To be safe, also add `*.XLSX diff=xlsx`.

## Known Issues and Limitations
- In VSCode, the nicely formatted visual diff will only be displayed if the XLSX file has been staged.
This is an issue with VSCode, and not this package, but doesn't seem to be on their backlog as this issue has been closed: https://github.com/microsoft/vscode/issues/168472

## Bugs and Requests
- Open up an issue on [our GitHub](https://github.com/DiefBell/XLSX-Diff)! 

## To-Do
- Build binaries so this can be used without NodeJS.
- Better way of working out headers for the visual diff.
- ???
