import multer from "multer";

export default function handler(req: any, res: any) {
  const upload = multer({
    storage: multer.diskStorage({
      destination: "./public/uploads",
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    }),
  }).single("gambar");

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }

    return res.status(200).send(req.file);
  });
}