import captureWebsite from "capture-website";
import fs from "fs";

const thumbnailSave = (workspaceId, cookie) => {
  const PATH = `./public/assets/images/thumbnail/${workspaceId}.png`;
  captureWebsite.file(`http://localhost:3000/workspace/${workspaceId}`, PATH, {
    cookies: [
      {
        name: "app.sid",
        value: cookie,
        url: "http://localhost:3000",
      },
    ],
    width: 800,
    height: 800,
  });
};

const captureThumbnail = (workspaceId, cookie) => {
  const PATH = `./public/assets/images/thumbnail/${workspaceId}.png`;
  try {
    fs.stat(PATH, (err) => {
      if (err?.code === "ENOENT") {
        thumbnailSave(workspaceId, cookie);
      } else {
        fs.unlink(PATH, () => {
          thumbnailSave(workspaceId, cookie);
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
};

export default { captureThumbnail };
