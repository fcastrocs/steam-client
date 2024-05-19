/**
 * Build steam enums
 * Build proto typings
 */

import { loadProtos } from '../src/modules/protos.js';
import { ReflectionObject } from 'protobufjs';
import fs, { createWriteStream } from 'fs';
import path from 'path';

const LANGUAGE_PATH = './resources/language/';
const PROTOS_TYPES_PATH = './@types/protos/';

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

    for (const key in root.nested) {
        const reflectionObj = root.nested[key];
        const name = reflectionObj.toString();

        if (name.includes('Enum .')) {
            processEmum(reflectionObj);
            continue;
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
    }

    const promises: PromiseLike<void>[] = [];
    for (let key of writeStreams.keys()) {
        promises.push(
            new Promise((resolve) => {
                writeStreams.get(key)?.close(() => {
                    resolve();
                });
            })
        );
    }

    await Promise.all(promises);
}

async function fetchEnumsSteamd() {
    const url =
        'https://raw.githubusercontent.com/SteamRE/SteamKit/master/Resources/SteamLanguage/enums.steamd';
    const enumsSteamd = (await fetch(url).then((res) => res.text())).split(
        /\r?\n/
    );
    const stream = createWriteStream(LANGUAGE_PATH + 'enums.steamd.ts');
    stream.write(HEADER + '\n\n');

    let skipEnum = false;

    for (let line of enumsSteamd) {
        if (line.match(/^enum /) || line.match('public enum')) {
            if (skipEnum) skipEnum = false;

            line =
                line
                    .replace(/^public /, '')
                    .replace('enum ', 'export enum ')
                    .replace(/ flags$/, '')
                    .replace(/<.+>/, '') + ' {\n';

            // skip enum if it was already written in another file
            if (
                processedEnums.has(
                    line.replace('export enum', '').replace('{', '').trim()
                )
            ) {
                skipEnum = true;
                continue;
            }

            stream.write(line);
            continue;
        }

        if (skipEnum) continue;

        if (
            line.includes('=') &&
            !line.includes('; removed') &&
            !line.includes('; obsolete') &&
            !line.match(/deprecated/i) &&
            !line.includes('|') &&
            line.match(/=\s\d+;/)
        ) {
            line = line
                .replace(/\s/g, '')
                .replace('=', ' = ')
                .replace(';', ',');
            stream.write(`\t${line}\n`);
        }

        if (line.includes('}')) stream.write(`}\n\n`);
    }

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
    const stream = createWriteStream(LANGUAGE_PATH + 'EResult.ts');
    stream.write(HEADER + '\n\n');

    for (let line of EResult) {
        if (line.match(/^enum /)) {
            stream.write(`export ${line} {\n`);
            continue;
        }

        if (line.includes('=') && !line.includes('; removed')) {
            line = line
                .replace(/\s/g, '')
                .replace('=', ' = ')
                .replace(';', ',');
            stream.write(`\t${line}\n`);
        }

        if (line.includes('}')) stream.write(`}\n\n`);
    }

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
    const values = enumType.toJSON().values;

    // add header
    if (!stream.bytesWritten) {
        stream.write(`${HEADER}\n\n`);
        stream.bytesWritten += 1;
    }

    stream.write(`export enum ${enumName} {\n`);
    const uniqueKeys = new Set();

    for (const key of Object.keys(values)) {
        if (key.match(/deprecated/i) || key.match(/obsolete/i)) continue;

        const modifiedKey = key.replace(`k_${enumName}`, '').replace(/.*_/, '');
        if (uniqueKeys.has(modifiedKey)) continue;
        uniqueKeys.add(modifiedKey);

        const keyValue = modifiedKey + ` = ${values[key]},`;
        stream.write(`\t${keyValue}\n`);
    }
    stream.write('}\n\n');
    processedEnums.add(enumName);
}

/**
 * Convert proto to a TS Type. Recursively converts nested protos and Enums
 */
function processProtoType(proto: ReflectionObject, indents: number): string {
    const protoJson = proto.toJSON();
    const root = proto.root;

    let protoType = '{\n';
    for (const item of Object.keys(protoJson.fields)) {
        // fix infinity loop "contained_item" in CEconItem_Description
        if (item === 'options' || item === 'containedItem') continue;
        let dataType = convertDataType(protoJson.fields[item].type);
        const isArray = protoJson.fields[item].rule ? '[]' : '';

        // nested data type
        if (dataType[0] === '.') {
            const nestedObj = root.lookup(dataType);
            const name = nestedObj?.toString();

            if (name?.includes('Type .')) {
                dataType = processProtoType(nestedObj, indents + 1);
            } else if (name?.includes('Enum .')) {
                processEmum(nestedObj);
                dataType = `typeof ${nestedObj.name}[keyof typeof ${nestedObj.name}]`;
            } else {
                throw new Error(`Unknown proto datatype.${name}`);
            }
        }

        //add indents
        for (let i = 0; i < indents; i++) {
            protoType += '\t';
        }

        protoType += `\t${item}?: ${dataType}${isArray}\n`;
    }
    for (let i = 0; i < indents; i++) protoType += '\t';
    protoType += '}';

    return protoType;
}

function getWriteStream(file: string, path: string) {
    const stream: fs.WriteStream =
        writeStreams.get(file + path) || createWriteStream(path + file);
    writeStreams.set(file + path, stream);
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
