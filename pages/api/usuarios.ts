import type { NextApiRequest, NextApiResponse } from "next";
import { respostaPadraoMsg } from "../../types/respostaPadraoMsg";
import nextConnect from "next-connect";
import { conectarMongoDB } from "../../middlewares/conecta-mongoDB";
import { usuarioModel } from "../../models/usuario-model";
//import { upload, uploadImagemCosmic } from "../../services/uploadImagemCosmic";
import { cadastroReqUsuario } from "../../types/cadastroReqUsuario";

const handler = nextConnect()
    //.use(upload.single('file'))
    .post(async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {
        try {
            //requerimento dos dados 
            const usuario = req.body as cadastroReqUsuario
            //validacao dos dados
            if (!usuario.nome || usuario.nome.length < 2) {
                return res.status(400).json({ erro: 'Nome invalido' });
            }

            if (!usuario.email || usuario.email.length < 5
                || !usuario.email.includes('@')
                || !usuario.email.includes('.')) {
                return res.status(400).json({ erro: 'Email invalido' });
            }

            if (!usuario.senha || usuario.senha.length < 4) {
                return res.status(400).json({ erro: 'Senha invalida' });
            }

            const usuariosComMesmoEmail = await usuarioModel.find({ email: usuario.email });
            if (usuariosComMesmoEmail && usuariosComMesmoEmail.length > 0) {
                return res.status(400).json({ erro: 'Ja existe uma conta com o email informado' });
            }


            // upload da imagem 
           // const image = await uploadImagemCosmic(req)

            //usuario salvo

            const usuarioASerSalvo = {
                nome: usuario.nome,
                email: usuario.email,
                endereco: usuario.endereco,
                cidade: usuario.cidade,
                estado: usuario.estado,
                senha: usuario.senha,
               // avatar: image?.media?.url,
                dataInclusao: new Date().toISOString()
            }

            //integracao com o banco de dados
            await usuarioModel.create(usuarioASerSalvo)

            return res.status(201).json({ msg: 'Usuario cadastrado com sucesso!' })

        } catch (e: any) {
            console.log(e);
            return res.status(500).json({ erro: e.toString() });
        }
    })

    .get(async (req: NextApiRequest, res: NextApiResponse) => {
        //traz uma lista com todos os usuarios cadastrados
        const usuario = await usuarioModel.find()
        //precisa fazer uma integracao com pedidos
        return res.status(400).json({ data: usuario })
    })
    .put(async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            const idUsuario = req?.query

            const usuarioAlterado = req.body as cadastroReqUsuario

            await usuarioModel.findById(idUsuario)
            const usuariosEncontrado = idUsuario

            if (!usuariosEncontrado) {
                return res.status(404).json({ erro: "Usuario nao encontrado" })
            }
            //const avatar = await uploadImagemCosmic(req)

            usuariosEncontrado.nome = usuarioAlterado.nome
            usuariosEncontrado.endereco = usuarioAlterado.endereco
            usuariosEncontrado.cidade = usuarioAlterado.cidade
            usuariosEncontrado.estado = usuarioAlterado.estado
            usuariosEncontrado.senha = usuarioAlterado.senha
            //usuariosEncontrado.avatar = avatar?.media?.url
            usuariosEncontrado.dataInclusao = new Date().toISOString()

            await usuarioModel.findByIdAndUpdate(idUsuario, usuariosEncontrado)

            return res.status(201).json({ msg: "Usuario alterado com sucesso" })
        } catch (e: any) {
            console.log(e);
            return res.status(500).json({ erro: e.toString() });
        }
    })
export const config = {
    api: {
        bodyParser: false
    }


}

export default conectarMongoDB(handler)