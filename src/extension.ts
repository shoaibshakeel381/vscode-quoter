'use strict';
import * as vscode from 'vscode';
import { chooseQuoteSymbol, chooseDelimitSymbol } from './helpers';

export function activate(context: vscode.ExtensionContext) {

    let quote = vscode.commands.registerCommand('extension.quoterQuoteStrings', () => quoteStrings());
    let unquote = vscode.commands.registerCommand('extension.quoterUnquoteStrings', () => unquoteStrings());
    let delimit = vscode.commands.registerCommand('extension.quoterDelimitStrings', () => delimitStrings());

    context.subscriptions.push(quote);
    context.subscriptions.push(unquote);
    context.subscriptions.push(delimit);
}

export function deactivate() {}

async function quoteStrings() {
    let editor = getActiveEditor();
    if (editor == null) {
        return;
    }

    // Get Text
    let range = getTextRange(editor);
    if (range == null){
        return;
    }
    let text = editor.document.getText(range);
    // Get User's choice of quote
    var quoteChar = await chooseQuoteSymbol();
    // Process
    let quotedResult = arrayToQuotedString(splitByNewLine(text), quoteChar);
    writeResults(quotedResult, range, editor);
}

async function unquoteStrings() {
    let editor = getActiveEditor();
    if (editor == null) {
        return;
    }

    // Get Text
    let range = getTextRange(editor);
    if (range == null){
        return;
    }
    let text = editor.document.getText(range);
    // Process
    let unquotedResult = arrayToUnquotedString(splitByNewLine(text));
    writeResults(unquotedResult, range, editor);
}

async function delimitStrings() {
    let editor = getActiveEditor();
    if (editor == null) {
        return;
    }

    // Get Text
    let range = getTextRange(editor);
    if (range == null){
        return;
    }
    let text = editor.document.getText(range);

    // Get User's choice of delimit character
    let delimitChar = await chooseDelimitSymbol();
    // Process
    let delimitedResult = arrayTodelimitedStrings(splitByNewLine(text), delimitChar);
    writeResults(delimitedResult, range, editor);
}

/**
 * Split by newlines (with optional carriage return)
 *
 * @param text the string to split
 */
function splitByNewLine(text: string): Array<string> {
    return text.split(/\r?\n/);
}

/**
 * quote array of strings
 * @param strings array of strings to convert
 */
function arrayToString (strings: Array<string>) : string {
    return strings
    .map((curr, idx, arr) => {
        return arr.length - 1 == idx ? `${curr}` : `${curr}\n`;
    })
    .reduce((curr,prev) : string => {
        return prev += `${curr}`;
    },"");
}

/**
 * quote array of strings
 * @param strings array of strings to convert
 */
function arrayToQuotedString (strings: Array<string>, quoteChar: string) : Array<string> {
    return strings.filter((el)=>{
        return el.trim() !== ""
    })
    .map((str)=>{
       return `${quoteChar}${str.trim()}${quoteChar}`;
    }).reverse();
}

/**
 * unquote array of strings
 * @param strings array of strings to convert
 */
function arrayToUnquotedString (strings: Array<string>) : Array<string> {
    return strings.filter((el)=>{
        return el.trim() !== ""
    })
    .map((str)=>{
    //    let pattern = isSingleQouted ? /^'(.*)'$/ : /^"(.*)"$/;
       let text = str.trim();
       return text.substring(1, text.length - 2);
    }).reverse();
}

function arrayTodelimitedStrings(strings: Array<string>, delimitChar: string) : Array<string> {
    return strings.filter((el)=>{
        return el.trim() !== ""
    })
    .map((el, idx, arr) => {return arr.length - 1 === idx ? `${el}` : `${el}${delimitChar}`})
    .reverse();
}

function getTextRange(editor: vscode.TextEditor) : vscode.Range {
    let range : vscode.Range = null;

    if (!editor.document.getText()) {
        vscode.window.showErrorMessage("No text found");
    } else if (!editor.selection.isEmpty) {
        range = new vscode.Range(editor.selection.start, editor.selection.end);
    } else {
        var firstLine = editor.document.lineAt(0);
        var lastLine = editor.document.lineAt(editor.document.lineCount - 1);
        range = new vscode.Range(firstLine.range.start, lastLine.range.end);
    }

    return range;
}

function getActiveEditor() : vscode.TextEditor {
    let editor = vscode.window.activeTextEditor;
    if (editor == null) {
        vscode.window.showErrorMessage("No text editor open");
    }

    return editor;
}

function writeResults(quotedResult: string[], range: vscode.Range, editor: vscode.TextEditor) {
    let result = arrayToString(quotedResult);
    editor.edit((builder) =>{
        builder.replace(range,result);
    });
    editor.revealRange(range);
}