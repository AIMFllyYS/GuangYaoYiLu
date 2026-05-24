import JSZip from "jszip";
import type { DeckSpec, SlideTransition } from "./types";

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
const MORPH_NAMESPACE = "http://schemas.microsoft.com/office/powerpoint/2015/09/main";

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

export async function applyMorphTransitions(input: ArrayBuffer | Blob | Uint8Array, deck: DeckSpec): Promise<Uint8Array> {
  const zip = await JSZip.loadAsync(input);

  for (let index = 1; index < deck.slides.length; index += 1) {
    const transition = deck.slides[index]?.transition;
    if (transition?.type !== "morph") {
      continue;
    }

    const slideName = `ppt/slides/slide${index + 1}.xml`;
    const slideFile = zip.file(slideName);
    const xml = await slideFile?.async("string");
    if (!xml) {
      throw new Error(`Missing slide XML for Morph transition: ${slideName}`);
    }

    zip.file(slideName, withMorphTransition(xml, transition));
  }

  return zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
}

function withMorphTransition(xml: string, transition: SlideTransition) {
  const transitionXml = buildMorphTransitionXml(transition);
  const withoutExistingTransition = xml.replace(/<p:transition\b[\s\S]*?<\/p:transition>|<p:transition\b[^>]*\/>/, "");

  if (withoutExistingTransition.includes("</p:cSld>")) {
    return withoutExistingTransition.replace("</p:cSld>", `</p:cSld>${transitionXml}`);
  }

  return withoutExistingTransition.replace("</p:sld>", `${transitionXml}</p:sld>`);
}

function buildMorphTransitionXml(transition: SlideTransition) {
  const option = transition.textMorph === "word" ? "byWord" : transition.textMorph === "char" ? "byChar" : "byObject";
  const speed = transition.durationMs <= 520 ? "fast" : transition.durationMs >= 1100 ? "slow" : "med";
  return `<p:transition spd="${speed}" advClick="1"><p159:morph xmlns:p159="${MORPH_NAMESPACE}" option="${option}"/></p:transition>`;
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
