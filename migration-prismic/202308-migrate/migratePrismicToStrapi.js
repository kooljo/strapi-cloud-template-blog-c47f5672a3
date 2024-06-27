import fs from "fs";
import path from "path";
import { copyCustomTypes, createZip } from "../utils";
import { withCoverSlice, withGenericSlice, withMetaContent } from "./mappers";

// Note: copy page from exported directory into migrated-page working directory
const migratedPageWorkDir = copyCustomTypes("migrated-page", "page-v2");

let fileStream = fs.createWriteStream(
  path.join(migratedPageWorkDir, "migration-strapi"),
  {
    flags: "a",
  }
);

fs.readdirSync(migratedPageWorkDir)
  .map((filename) => ({
    filename,
    content: JSON.parse(
      fs.readFileSync(path.join(migratedPageWorkDir, filename)).toString()
    ),
  }))
  .forEach(({ filename, content }) =>
    fileStream.write(
      JSON.stringify(
        {
          type: "page-v2",
          tags: content?.tags,
          lang: content?.lang,
          grouplang: content?.grouplang,
        },
        null,
        2
      )
    )
  );
fileStream.end();

console.log("Migration from page to page-v2 finished", { migratedPageWorkDir });

createZip(migratedPageWorkDir, () => {
  console.log("   ");
  console.log("------------------------------------------------------------");
  console.log(
    "Import all .export/migrated-page_X.zip at https://www-axa-com.axa-contento-118412.eu/settings/import/"
  );
  console.log("------------------------------------------------------------");
});
