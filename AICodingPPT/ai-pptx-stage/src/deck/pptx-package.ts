import JSZip from "jszip";

export type PptxPackageInspection = {
  slideCount: number;
  mediaCount: number;
  objectNames: string[];
  hasMojibake: boolean;
  hasMorphTransitions: boolean;
  missingEntries: string[];
  mojibakeFiles: string[];
};

const REQUIRED_ENTRIES = ["[Content_Types].xml", "ppt/presentation.xml"];
const MOJIBAKE_PATTERN = /\uFFFD|\u00C3|\u00C2|\u951F/;

export async function inspectPptxPackage(input: ArrayBuffer | Blob | Uint8Array): Promise<PptxPackageInspection> {
  const zip = await JSZip.loadAsync(input);
  const fileNames = Object.keys(zip.files);
  const slideNames = fileNames.filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name)).sort(compareSlideNames);
  const mediaCount = fileNames.filter((name) => /^ppt\/media\/[^/]+$/.test(name)).length;
  const missingEntries = REQUIRED_ENTRIES.filter((name) => !zip.file(name));
  const objectNames = new Set<string>();
  const mojibakeFiles: string[] = [];
  let hasMorphTransitions = false;

  for (const name of slideNames) {
    const xml = await zip.file(name)?.async("string");
    if (!xml) {
      continue;
    }

    if (MOJIBAKE_PATTERN.test(xml)) {
      mojibakeFiles.push(name);
    }

    if (/<[^>]*morph\b/i.test(xml)) {
      hasMorphTransitions = true;
    }

    for (const match of xml.matchAll(/\bname="([^"]+)"/g)) {
      objectNames.add(decodeXml(match[1] ?? ""));
    }
  }

  return {
    slideCount: slideNames.length,
    mediaCount,
    objectNames: [...objectNames].sort(),
    hasMojibake: mojibakeFiles.length > 0,
    hasMorphTransitions,
    missingEntries,
    mojibakeFiles
  };
}

function compareSlideNames(a: string, b: string) {
  return slideNumber(a) - slideNumber(b);
}

function slideNumber(name: string) {
  return Number(name.match(/slide(\d+)\.xml$/)?.[1] ?? 0);
}

function decodeXml(value: string) {
  return value
    .replaceAll("&quot;", "\"")
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}
