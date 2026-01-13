import Document from "../models/Document.js";

export const uploadDoc = async (req, res) => {
  const doc = await Document.create({
    userId: req.params.id,
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size,
    filePath: req.file.path,
  });
  res.json(doc);
};

export const getDocs = async (req, res) => {
  const docs = await Document.find({ userId: req.params.id });
  res.json(docs);
};

export const deleteDoc = async (req, res) => {
  await Document.findByIdAndDelete(req.params.docId);
  res.json({ message: "Document deleted" });
};
