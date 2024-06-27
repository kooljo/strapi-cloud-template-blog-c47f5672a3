import fs from "fs";
import path from "path";
import rimraf from "rimraf";
import mkdirp from "mkdirp";
import archiver from "archiver";
import { chunk, isEmpty } from "lodash";

/** The tmp dir for all the migration process */
export const tmpDir = path.join(process.cwd(), ".export");

/** The contento exported directory with all exported documents at root */
if (!process.env.EXPORT_DIRECTORY) {
  console.log(
    "Migrate error: please specify the export directory using the environment variable EXPORT_DIRECTORY (for example 02-02-2021#13-08-45_www-axa-com)"
  );
  console.log(
    "IMPORTANT: the export directory MUST be placed in .export directory)"
  );
  process.exit(1);
}
export const exportDir = path.join(tmpDir, process.env.EXPORT_DIRECTORY);
console.log("Migrate using contento export directory", { exportDir });

/** Recreate directory */
export function recreateDirectory(directoryName) {
  const workDir = path.join(tmpDir, directoryName);
  console.log(`Migrate recreate ${directoryName} working dir`, { workDir });
  rimraf.sync(workDir);
  mkdirp.sync(workDir);
  return workDir;
}

/** Copy custom-types into directory */
export function copyCustomTypes(directory, customType) {
  const workDir = recreateDirectory(directory);
  const customTypes = Array.isArray(customType) ? customType : [customType];
  fs.readdirSync(exportDir)
    .map((filename) => ({
      filename,
      content: JSON.parse(
        fs.readFileSync(path.join(exportDir, filename)).toString()
      ),
    }))
    .filter(({ content }) => customTypes.includes(content.type))
    .forEach(({ filename, content }) =>
      fs.writeFileSync(
        path.join(workDir, filename),
        JSON.stringify(content, null, 2)
      )
    );
  console.log(
    `Migrate moved ${customTypes.join(
      ","
    )} documents in ${directory} working dir`,
    { themeWorkDir: workDir }
  );
  return workDir;
}

/**
 * Create a zip file handling all prismic limits.
 *
 * See https://user-guides.prismic.io/en/articles/846079-introduction-to-import-export
 */
export function createZip(sourceDir, cb = () => {}) {
  const filesTooBig = [];
  const chunks = chunk(
    fs.readdirSync(sourceDir).filter(
      (file) => {
        const { size } = fs.statSync(path.join(sourceDir, file));
        const sizeOk = size < 240000;
        if (!sizeOk) {
          filesTooBig.push(file);
        }
        return sizeOk;
      },
      [{ size: 0, chunk: [] }]
    ),
    180
  );

  filesTooBig.forEach((file) => {
    try {
      fs.copyFileSync(
        path.join(sourceDir, file),
        path.join(`${sourceDir}-${file}`)
      );
    } catch (e) {
      console.log("Migrate cannot copy file too big:", e);
    }
  });

  chunks.forEach((files, i) => {
    const archive = archiver("zip", { zlib: { level: 9 } });
    const zipFile = path.join(
      `${sourceDir}${chunks.length > 1 ? `_${i}` : ""}.zip`
    );
    console.log("Migrate remove zip file if exists", { zipFile });
    try {
      fs.unlinkSync(zipFile);
    } catch (e) {
      // Ignore not existing file
    }

    const output = fs.createWriteStream(zipFile);
    archive.on("warning", (err) =>
      err.code === "ENOENT"
        ? console.log("Archiver got warning", { zipFile, err })
        : console.log("Archiver got error", { zipFile, err })
    );
    archive.on("error", (err) =>
      console.log("Archiver got error", { zipFile, err })
    );
    output.on("close", () => {
      console.log(
        "Archiver has been finalized and the output file descriptor has closed",
        { zipFile, bytes: archive.pointer() }
      );
      if (filesTooBig.length) {
        console.log("BE CAREFUL: files too big not exported in zip files", {
          filesTooBig,
        });
      }
      cb();
    });
    archive.pipe(output);
    files.forEach((name) =>
      archive.append(fs.createReadStream(path.join(sourceDir, name)), { name })
    );
    archive.finalize();
  });
}

/** Return empty object if no value on content[key] */
export function convertOrEmpty(key, content, fn) {
  return !isEmpty(content[key]) ? { [key]: fn(content[key]) } : {};
}

/** Apply map function if content is an array */
export function mapIfArray(content, map) {
  return Array.isArray(content) ? content.map(map) : content;
}

/** Pretty stringify a map object */
export function toPrettyString(array) {
  return array.map(([key, count]) => `${key} ${count}`).join("\n");
}

/** Recursive function which deep search a string in an object */
export function findInObject(obj, searchString) {
  for (let key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      if (findInObject(obj[key], searchString)) {
        return true;
      }
    } else if (
      typeof obj[key] === "string" &&
      obj[key].includes(searchString)
    ) {
      return true;
    }
  }
  return false;
}
