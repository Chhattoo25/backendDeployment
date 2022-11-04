const express = require("express");
const { NotesModel } = require("../model/Notes.model");

const notesRouter = express.Router();

notesRouter.get("/", async (req, res) => {
  const notes = await NotesModel.find({userId});
  res.send(notes)
});

notesRouter.post("/:userId/post", async (req, res) => {
  const userId = req.params.userId;
  const { title, notes, tags } = req.body;
  const new_note = new NotesModel({
    title,
    notes,
    tags,
    userId,
  });
  await new_note.save();
  res.send({ message: "note created successfully", new_note });
});

notesRouter.patch("/:userId/update/:notesId", async (req, res) => {
  const userId = req.params.userId;
  const notesId = req.params.notesId;
  const note = await NotesModel.findOne({ _id: notesId });

  if (note.userId !== userId) {
    return res.send("You are not authorized");
  }
  const new_note = await NotesModel.findByIdAndUpdate(notesId, req.body);
  res.send({ message: "updated", new_note });
});

notesRouter.delete("/:userId/delete/:notesId", async (req, res) => {
  const userId = req.params.userId;
  const notesId = req.params.notesId;
  const note = await NotesModel.findOne({ _id: notesId });
  if (note.userId !== userId) {
                     return res.send("You are not authorized");
                   }
  const new_note = await NotesModel.findByIdAndDelete(notesId, );
  res.send({ message: "deleted", new_note });
});

module.exports = notesRouter;
