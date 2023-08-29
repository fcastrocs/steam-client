import { Root } from "../modules/protos.js";
import { ReflectionObject } from "protobufjs";
import fs, { createWriteStream } from "fs";
import path from "path";

const ENUMTYPESDIR = "./src/language/";
const PROTOTYPESDIR = "./@types/protos/";
const writeStreams: Map<string, fs.WriteStream> = new Map();
const processedEnums: Set<string> = new Set();
const HEADER = `/**
 * Auto-generated file
 * ${new Date()}
 */`;

export default function extractEnumsAndTypes() {
  for (const key in Root.nested) {
    const reflectionObj = Root.nested[key];
    const name = reflectionObj.toString();

    if (name.includes("Enum .")) {
      processEmum(reflectionObj);
      continue;
    }

    if (name.includes("Type .")) {
      const file = path.basename(reflectionObj.filename as string).replace(".proto", ".d.ts");
      const stream = getWriteStream(file, PROTOTYPESDIR);

      // add header and imports
      if (!stream.bytesWritten) {
        stream.write(`${HEADER}\n\n`);
        stream.write(`declare type Long = import("long");\n`);
        stream.write(`type ValueOf<T> = T[keyof T];\n\n`);
        stream.bytesWritten += 1;
      }

      stream.write(`type ${reflectionObj.name} = `);
      const typing = processProtoType(reflectionObj, 0);
      stream.write(`${typing}\n\n`);
    }
  }
}

/**
 * Convert enum to a TS type and write to file
 */
function processEmum(enumType: ReflectionObject) {
  const enumName = enumType.name;
  if (processedEnums.has(enumName)) {
    return;
  }
  const file = path.basename(enumType.filename as string).replace(".proto", ".ts");
  const stream = getWriteStream(file, ENUMTYPESDIR);
  const values = enumType.toJSON().values;

  // add header
  if (!stream.bytesWritten) {
    stream.write(`${HEADER}\n\n`);
    stream.bytesWritten += 1;
  }

  stream.write(`export const ${enumName} = {\n`);
  const uniqueKeys = new Set();

  for (const key of Object.keys(values)) {
    if (key.match(/deprecated/i) || key.match(/obsolete/i)) continue;

    const modifiedKey = key.replace(`k_${enumName}`, "").replace(/.*_/, "");
    if (uniqueKeys.has(modifiedKey)) continue;
    uniqueKeys.add(modifiedKey);

    const keyValue = modifiedKey + `: ${values[key]},`;
    stream.write(`\t${keyValue}\n`);
  }
  stream.write("}\n\n");
  processedEnums.add(enumName);
}

/**
 * Convert proto to a TS Type. Recursively converts nested protos and Enums
 */
function processProtoType(proto: ReflectionObject, indents: number): string {
  const protoJson = proto.toJSON();

  let protoType = "{\n";
  for (const item of Object.keys(protoJson.fields)) {
    // fix infinity loop "contained_item" in CEconItem_Description
    if (item === "options" || item === "containedItem") continue;
    let dataType = convertDataType(protoJson.fields[item].type);
    const isArray = protoJson.fields[item].rule ? "[]" : "";

    // nested data type
    if (dataType[0] === ".") {
      const nestedObj = Root.lookup(dataType);
      const name = nestedObj?.toString();

      if (name?.includes("Type .")) {
        dataType = processProtoType(nestedObj!, indents + 1);
      } else if (name?.includes("Enum .")) {
        processEmum(nestedObj!);
        dataType = `ValueOf<typeof ${nestedObj?.name!}>`;
      } else {
        throw new Error(`Unknown proto datatype.${name}`);
      }
    }

    //add indents
    for (let i = 0; i < indents; i++) {
      protoType += "\t";
    }

    protoType += `\t${item}?: ${dataType}${isArray};\n`;
  }
  for (let i = 0; i < indents; i++) protoType += "\t";
  protoType += "}";

  return protoType;
}

function getWriteStream(file: string, path: string) {
  const stream: fs.WriteStream = writeStreams.get(file + path) || createWriteStream(path + file);
  writeStreams.set(file + path, stream);
  return stream;
}

function convertDataType(type: string) {
  switch (type) {
    case "float":
    case "double":
    case "int32":
    case "uint32":
    case "sint32":
    case "fixed32":
    case "sfixed32":
      return "number";

    case "int64":
    case "uint64":
    case "sint64":
    case "fixed64":
    case "sfixed64":
      return "Long";

    case "bool":
      return "boolean";

    case "string":
      return "string";

    case "bytes":
      return "Buffer";

    default: // enum or proto
      if (type[0] === ".") {
        return type;
      }

      throw new Error("Unknown proto datatype.");
  }
}
