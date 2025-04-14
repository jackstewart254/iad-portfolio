// pages/api/users/index.ts
import { prisma } from "../../prisma";
import hashPassword from "@/components/hashPassword";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { mode } = req.body;
    if (mode === "SIGNUP") {
      const { username, email, password } = req.body;
      const findUser = await prisma.user.findUnique({
        where: { email: email },
      });
    if (findUser) {
      return res.status(400).json({ error: "User already exists" });
    } else {
      const hashedPassword = await hashPassword(password);
      const user = await prisma.user.create({
        data: { username: username, email: email, password: hashedPassword },
      });
      return res.status(201).json(user);
      }
    } else if (mode === "LOGIN") {
      const { email, password } = req.body;
    
      const findUser = await prisma.user.findUnique({
        where: { email: email },
      });
    
      if (findUser !== null) {
        const isPasswordValid = await bcrypt.compare(password, findUser.password);
        
        if (isPasswordValid) {
          return res.status(200).json(findUser);
        } else {
          return res.status(401).json({ error: "Invalid password" });
        }
      } else {
        return res.status(404).json({ error: "No users found" });
      }
    }    
  }
  return res.status(405).end(`Method ${req.method} Not Allowed`);
} 
