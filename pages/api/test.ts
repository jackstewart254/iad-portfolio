import { prisma } from "../../prisma"

export default async function handler(req, res) {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error("🔥 Prisma error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
