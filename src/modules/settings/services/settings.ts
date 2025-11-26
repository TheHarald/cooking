export const info = {
  buildDate: new Date().toISOString(),
  buildVersion: "dev",
};
const infoPath = "/cooking/info.json";

fetch(infoPath)
  .then((response) => response.json())
  .then((data) => {
    info.buildDate = data.buildDate;
    info.buildVersion = data.buildVersion;
  })
  .catch((e) => {
    console.warn("Build info file not found, using default values", e);
  });
