import { usersService } from "../services/index.js";


const getUsers = async (req, res) => {
  let users = await usersService.getUsers();

  res.send({status:"success", payload:users});

}


const getUsersById = async (req, res) => {
  const {uid} = req.params;
  let user  = await usersService.getUserById();
  if(!user) return  res.status(400).send({status:"error",error:'Usuario no encontrado'});
}





export default{
  getUsers,
  getUsersById,

}