async function main() {
  const mod = await import("pdf-parse");
  console.log(typeof mod.PDFParse);
  if (typeof mod.PDFParse === "function") {
    console.log("PDFParse is the function we need!");
  } else if (typeof mod === "function") {
      console.log("Module is function!");
  } else {
      console.log("How do we call it? ", mod);
  }
}
main();
