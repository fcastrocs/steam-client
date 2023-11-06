/**
 * Fetch Steam Protos
 * Build Steam Language (enums and proto types)
 */

import fs from "fs";
import buildEnums from "./buildEnumsAndProtoTypings.js";
import fetchProtos from "./fetchProtos.js";

const LANGUAGE_PATH = "./resources/language/";

(async () => {
    await fetchProtos();
    await buildEnums();
    declareEnumTypes();
})();

function declareEnumTypes() {
    const filenames = fs.readdirSync(LANGUAGE_PATH);

    for (const filename of filenames) {
        let file = fs.readFileSync(LANGUAGE_PATH + filename).toString();
        file = file.replace(/export enum/g, "declare enum");
        fs.writeFileSync("./@types/protos/enums/" + filename.replace(".ts", ".d.ts"), file);
    }
}
