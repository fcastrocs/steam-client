/**
 * Build steam enums
 * Build proto typings
 */

import { ReflectionObject } from 'protobufjs';
import fs, { createWriteStream } from 'fs';
import path from 'path';
import { loadProtos } from '../src/modules/protos';

const LANGUAGE_PATH = 'resources/language/';
const PROTOS_TYPES_PATH = '@types/protos/';

const writeStreams: Map<string, fs.WriteStream> = new Map();
const processedEnums: Set<string> = new Set();

const HEADER = `/**
 * Auto-generated file
 * ${new Date()}
 */`;

export default async function main() {
    await extractEnumsAndProtoTypes();
    await fetchEnumsSteamd();
    await fetchEResult();
}

/**
 * Extract enums and build proto types from proto files
 */
async function extractEnumsAndProtoTypes() {
    const root = await loadProtos();
    if (!root.nested) return;
    const nested = root.nested;

    Object.keys(nested).forEach((key) => {
        const item = nested[key];
        const name = item.toString();

        if (name.includes('Enum .')) {
            processProtoEmum(item);
            return;
        }

        if (name.includes('Type .')) {
            const file = path.basename(item.filename as string).replace('.proto', '.d.ts');
            const stream = getWriteStream(file, PROTOS_TYPES_PATH);

            // add header and imports
            if (!stream.bytesWritten) {
                stream.write(`${HEADER}\n\n`);
                stream.write(`import Long from "long";\n`);
                stream.write(`import { ValueOf } from "type-fest";\n\n`);
                stream.bytesWritten += 1;
            }

            stream.write(`export type ${item.name} = `);
            const typing = processProtoType({ proto: item });
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

/**
 * Convert proto to a TS Type. Recursively converts nested protos and Enums
 */
function processProtoType({ proto, indents = 0 }: { proto: ReflectionObject; indents?: number }): string {
    const protoJson = proto.toJSON();

    let protoType = '{\n';

    Object.keys(protoJson.fields).forEach((item) => {
        // fix infinity loop "contained_item" in CEconItem_Description
        if (item === 'options' || item === 'containedItem') return;

        let dataType = convertDataType(protoJson.fields[item].type);
        const isArray = protoJson.fields[item].rule ? '[]' : '';

        const nestedObj = proto.root.lookup(dataType) as ReflectionObject;

        if (dataType[0] === 'Type .') {
            dataType = processProtoType({
                proto: nestedObj,
                indents: indents + 1
            });
        } else if (dataType[0] === 'Enum .') {
            processProtoEmum(nestedObj);
            dataType = `typeof ${nestedObj.name}[keyof typeof ${nestedObj.name}]`;
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

/**
 * Convert enum to a TS type and write to file
 */
function processProtoEmum(enumType: ReflectionObject) {
    const enumName = enumType.name;
    if (processedEnums.has(enumName)) return;

    const file = path.basename(enumType.filename as string).replace('.proto', '.ts');
    const stream = getWriteStream(file, LANGUAGE_PATH);
    const { values } = enumType.toJSON();

    // add header
    if (!stream.bytesWritten) {
        stream.write('/* eslint-disable import/prefer-default-export */\n');
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

async function fetchEnumsSteamd() {
    const url = 'https://raw.githubusercontent.com/SteamRE/SteamKit/master/Resources/SteamLanguage/enums.steamd';
    const enumsSteamd = (await fetch(url).then((res) => res.text())).split(/\r?\n/);

    await enumToTypescript(enumsSteamd, 'enums.steamd');
}

async function fetchEResult() {
    const url = 'https://raw.githubusercontent.com/SteamRE/SteamKit/master/Resources/SteamLanguage/eresult.steamd';
    const EResult = (await fetch(url).then((res) => res.text())).split(/\r?\n/);

    await enumToTypescript(EResult, 'EResult');
}

async function enumToTypescript(enumList: string[], fileName: string) {
    const stream = createWriteStream(`${LANGUAGE_PATH}${fileName}.ts`);
    stream.write(`/* eslint-disable import/prefer-default-export */\n`);
    stream.write(`${HEADER}\n\n`);
    let duplicateEnum = false;

    // convert enum to typescript
    enumList.forEach((line) => {
        let newLine = line;

        // write enum name
        if (newLine.match(/^enum /) || newLine.match('public enum')) {
            duplicateEnum = false;

            // clean line, to just leave name of enum
            newLine = `${newLine
                .replace(/^public /, '')
                .replace(/ flags$/, '')
                .replace(/^enum /, 'export enum ')
                .replace(/<.+>/, '')} {\n`;

            // skip enum if it was already written in another file
            if (processedEnums.has(newLine.replace('export enum', '').replace('{', '').trim())) {
                duplicateEnum = true;
                return;
            }

            stream.write(newLine);
            return;
        }

        if (duplicateEnum) return;

        // write enum properties
        if (
            newLine.includes('=') &&
            !newLine.includes('; removed') &&
            !newLine.includes('; obsolete') &&
            !newLine.match(/deprecated/i) &&
            !newLine.includes('|') &&
            newLine.match(/=\s\d+;/)
        ) {
            newLine = newLine.replace(/\s/g, '').replace('=', ' = ').replace(';', ',');
            stream.write(`\t${newLine}\n`);
        }

        if (newLine.includes('}')) stream.write(`}\n\n`);
    });

    // wait for stream to close
    return new Promise((resolve) => {
        stream.close(() => {
            resolve('closed');
        });
    });
}

function getWriteStream(file: string, filePath: string) {
    const stream: fs.WriteStream = writeStreams.get(file + filePath) || createWriteStream(filePath + file);
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
