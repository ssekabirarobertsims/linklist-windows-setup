import fs from "node:fs";
import path from "node:path";

type ArchivedLink = {
  archivedAt?: string;
  expiresAt?: string;
};

const PurgeExpiredArchivedLinks = (application: {
  getPath: (name: "userData") => string;
}): void => {
  const archivedLinksFilePath = path.join(
    application.getPath("userData"),
    "Archives",
    "archived_links.json",
  );

  if (!fs.existsSync(archivedLinksFilePath)) {
    return;
  }

  try {
    const archives = JSON.parse(
      fs.readFileSync(archivedLinksFilePath, "utf8"),
    ) as ArchivedLink[];
    const now = Date.now();
    const activeArchives = archives.filter((archive) => {
      if (!archive.expiresAt) {
        return true;
      }

      return new Date(archive.expiresAt).getTime() > now;
    });

    if (activeArchives.length !== archives.length) {
      fs.writeFileSync(
        archivedLinksFilePath,
        JSON.stringify(activeArchives, null, 2),
      );
    }
  } catch (error) {
    console.error("Failed to purge expired archived links:", error);
  }
};

export default PurgeExpiredArchivedLinks;
