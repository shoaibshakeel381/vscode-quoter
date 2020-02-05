import { window } from 'vscode';

/**
 * Prompts user for inputting quotes using window.showInputBox().
 */
export async function chooseQuoteSymbol() {
	const result = await window.showInputBox({
		value: '\"',
		placeHolder: 'Enter single (\') or double (\") quotes',
		validateInput: text => text !== '\'' && text !== '\"' ? 'Only single or double quote character is allowed' : null
	});
	return result;
}

export async function chooseDelimitSymbol() {
	const result = await window.showInputBox({
		value: ',',
		placeHolder: 'Enter delimit symbol. (\\n for new-line)',
		validateInput: text => !text ? 'Atleast one character is required' : null
	});
	return result;
}

export async function chooseSymbolToUnquote(): Promise<boolean> {
	const result = await window.showQuickPick(["Single Quote (\')", "Double Quote (\")"],
		{
			placeHolder: "Select symbol to unquote"
		}
	);
	return result == 'Single Quote (\')';
}