/**
 * Build steam enums
 * Build proto typings
 */

import { ReflectionObject } from 'protobufjs';
import fs, { createWriteStream } from 'fs';
import path from 'path';
import { loadProtos } from '../src/modules/protos';

const LANGUAGE_PATH = './src/resources/language/';
const PROTOS_TYPES_PATH = '@types/protos/';

const writeStreams: Map<string, fs.WriteStream> = new Map();
const processedEnums: Set<string> = new Set();
const HEADER = `/**
 * Auto-generated file
 * ${new Date()}
 */`;

export default async function main() {
    await extractEnumsAndProtoTypings();
    await fetchEnumsSteamd();
    await fetchEResult();
}

/**
 * Extract enums and build proto types from proto files
 */
async function extractEnumsAndProtoTypings() {
    const root = await loadProtos();
    if (!root.nested) return;

    Object.keys(root.nested).forEach((key) => {
        if (!root.nested) return;

        const reflectionObj = root.nested[key];
        const name = reflectionObj.toString();

        if (name.includes('Enum .')) {
            processEmum(reflectionObj);
            return;
        }

        if (name.includes('Type .')) {
            const file = path
                .basename(reflectionObj.filename as string)
                .replace('.proto', '.d.ts');
            const stream = getWriteStream(file, PROTOS_TYPES_PATH);

            // add header and imports
            if (!stream.bytesWritten) {
                stream.write(`${HEADER}\n\n`);
                stream.write(`import Long from "long";\n`);
                stream.write(`import { ValueOf } from "type-fest";\n\n`);
                stream.bytesWritten += 1;
            }

            stream.write(`export type ${reflectionObj.name} = `);
            const typing = processProtoType(reflectionObj, 0);
            stream.write(`${typing}\n\n`);
        }
    });

    const promises: PromiseLike<void>[] = [];

    writeStreams.forEach((value) => {
        promises.push(
            new Promise((resolve) => {
                value.close(() => resolve());
            })
        );
    });

    await Promise.all(promises);
}

async function fetchEnumsSteamd() {
    const url =
        'https://raw.githubusercontent.com/SteamRE/SteamKit/master/Resources/SteamLanguage/enums.steamd';
    const enumsSteamd = (await fetch(url).then((res) => res.text())).split(
        /\r?\n/
    );
    const stream = createWriteStream(`${LANGUAGE_PATH}enums.steamd.ts`);
    stream.write(`${HEADER}\n\n`);

    let skipEnum = false;

    enumsSteamd.forEach((line) => {
        let newLine = line;

        if (newLine.match(/^enum /) || newLine.match('public enum')) {
            if (skipEnum) skipEnum = false;

            newLine = `${newLine
                .replace(/^public /, '')
                .replace('enum ', 'export enum ')
                .replace(/ flags$/, '')
                .replace(/<.+>/, '')} {\n`;

            // skip enum if it was already written in another file
            if (
                processedEnums.has(
                    newLine.replace('export enum', '').replace('{', '').trim()
                )
            ) {
                skipEnum = true;
                return;
            }

            stream.write(newLine);
            return;
        }

        if (skipEnum) return;

        if (
            newLine.includes('=') &&
            !newLine.includes('; removed') &&
            !newLine.includes('; obsolete') &&
            !newLine.match(/deprecated/i) &&
            !newLine.includes('|') &&
            newLine.match(/=\s\d+;/)
        ) {
            newLine = newLine
                .replace(/\s/g, '')
                .replace('=', ' = ')
                .replace(';', ',');
            stream.write(`\t${newLine}\n`);
        }

        if (newLine.includes('}')) stream.write(`}\n\n`);
    });

    return new Promise((resolve) => {
        stream.close(() => {
            resolve('closed');
        });
    });
}

async function fetchEResult() {
    const url =
        'https://raw.githubusercontent.com/SteamRE/SteamKit/master/Resources/SteamLanguage/eresult.steamd';
    const EResult = (await fetch(url).then((res) => res.text())).split(/\r?\n/);
    const stream = createWriteStream(`${LANGUAGE_PATH}EResult.ts`);
    stream.write(`${HEADER}\n\n`);

    EResult.forEach((line) => {
        let newLine = line;

        if (newLine.match(/^enum /)) {
            stream.write(`${newLine} {\n`);
            return;
        }

        if (newLine.includes('=') && !newLine.includes('; removed')) {
            newLine = newLine
                .replace(/\s/g, '')
                .replace('=', ' = ')
                .replace(';', ',');
            stream.write(`\t${newLine}\n`);
        }

        if (newLine.includes('}')) stream.write(`}\n\n export default EResult`);
    });

    return new Promise((resolve) => {
        stream.close(() => {
            resolve('closed');
        });
    });
}

/**
 * Convert enum to a TS type and write to file
 */
function processEmum(enumType: ReflectionObject) {
    const enumName = enumType.name;
    if (processedEnums.has(enumName)) return;

    const file = path
        .basename(enumType.filename as string)
        .replace('.proto', '.ts');
    const stream = getWriteStream(file, LANGUAGE_PATH);
    const { values } = enumType.toJSON();

    // add header
    if (!stream.bytesWritten) {
        stream.write(`${HEADER}\n\n`);
        stream.bytesWritten += 1;
    }

    stream.write(`export enum ${enumName} {\n`);
    const uniqueKeys = new Set();

    Object.keys(values).forEach((key) => {
        if (key.match(/deprecated/i) || key.match(/obsolete/i)) return;

        const modifiedKey = key.replace(`k_${enumName}`, '').replace(/.*_/, '');
        if (uniqueKeys.has(modifiedKey)) return;
        uniqueKeys.add(modifiedKey);

        const keyValue = `${modifiedKey} = ${values[key]},`;
        stream.write(`\t${keyValue}\n`);
    });

    stream.write('}\n\n');
    processedEnums.add(enumName);
}

/**
 * Convert proto to a TS Type. Recursively converts nested protos and Enums
 */
function processProtoType(proto: ReflectionObject, indents: number): string {
    const protoJson = proto.toJSON();
    const { root } = proto;

    let protoType = '{\n';

    Object.keys(protoJson.fields).forEach((item) => {
        // fix infinity loop "contained_item" in CEconItem_Description
        if (item === 'options' || item === 'containedItem') return;
        let dataType = convertDataType(protoJson.fields[item].type);
        const isArray = protoJson.fields[item].rule ? '[]' : '';

        // nested data type
        if (dataType[0] === '.') {
            const nestedObj = root.lookup(dataType);
            if (!nestedObj) return;
            const name = nestedObj?.toString();

            if (name.includes('Type .')) {
                dataType = processProtoType(nestedObj, indents + 1);
            } else if (name?.includes('Enum .')) {
                processEmum(nestedObj);
                dataType = `typeof ${nestedObj.name}[keyof typeof ${nestedObj.name}]`;
            } else {
                throw new Error(`Unknown proto datatype.${name}`);
            }
        }

        // add indents
        for (let i = 0; i < indents; i += 1) {
            protoType += '\t';
        }

        protoType += `\t${item}?: ${dataType}${isArray}\n`;
    });

    for (let i = 0; i < indents; i += 1) protoType += '\t';
    protoType += '}';

    return protoType;
}

function getWriteStream(file: string, filePath: string) {
    const stream: fs.WriteStream =
        writeStreams.get(file + filePath) || createWriteStream(filePath + file);
    writeStreams.set(file + filePath, stream);
    return stream;
}

function convertDataType(type: string) {
    switch (type) {
        case 'float':
        case 'double':
        case 'int32':
        case 'uint32':
        case 'sint32':
        case 'fixed32':
        case 'sfixed32':
            return 'number';

        case 'int64':
        case 'uint64':
        case 'sint64':
        case 'fixed64':
        case 'sfixed64':
            return 'Long';

        case 'bool':
            return 'boolean';

        case 'string':
            return 'string';

        case 'bytes':
            return 'Buffer';

        default: // enum or proto
            if (type[0] === '.') {
                return type;
            }

            throw new Error('Unknown proto datatype.');
    }
}
