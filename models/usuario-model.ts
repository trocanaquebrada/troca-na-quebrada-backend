import mongoose from "mongoose";
import { Schema } from "mongoose";

const UsuarioSchema = new Schema({
    nome : {type : String, required : true},
    email : {type : String, required : true},
    senha : {type : String, required : true},
    avatar : {type : String, required : true},
    avaliacoes : {type : Number, default: 0},
    cpf: {type : Number, required: true},
    dataInclusao:{type: Date, required :true},
});

export const usuarioModel = (mongoose.models.usuarios ||
    mongoose.model('usuarios', UsuarioSchema))