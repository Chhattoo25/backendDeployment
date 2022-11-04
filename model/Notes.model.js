const mongoose = require('mongoose');


const notesSchema  = mongoose.Schema({
 title:String,
 notes:String,
 tags:String,
 userId:{type:String,required:true}
})
const NotesModel = mongoose.model("note",notesSchema)

module.exports = {
 NotesModel
}