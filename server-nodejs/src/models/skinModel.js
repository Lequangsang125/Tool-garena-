import mongoose from 'mongoose'

const skinSchema = new mongoose.Schema({
    id_skins: {type:String, required:true, unique:true},
    name: {type:String,required: true},
    label: {type: String, default: "N/A"},
    label_level: {type:String,default: ""},
    image: {type: String, required: true},
    hero_id: 
})