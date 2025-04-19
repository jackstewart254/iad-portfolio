import { prisma } from "@/prisma/index";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const recipes = await prisma.recipe.findMany({
      include: { user: true },
    });
    return res.status(200).json(recipes);
  }

  if (req.method === "POST") {
    const { name, description, type, cookingtime, ingredients, instructions, image, uid } = req.body;

    const recipe = await prisma.recipe.create({
      data: {
        name,
        description,
        type,
        cookingtime,
        ingredients,
        instructions,
        image,
        uid,
      },
    });

    return res.status(201).json(recipe);
  }

  if (req.method === "PUT") {
    const { rid, name, description, type, cookingtime, ingredients, instructions, image, uid } = req.body;

    if (!rid) {
      return res.status(400).json({ error: "Missing recipe ID (rid)" });
    }

    const updatedRecipe = await prisma.recipe.update({
      where: { rid },
      data: {
        name,
        description,
        type,
        cookingtime,
        ingredients,
        instructions,
        image,
        uid,
      },
    });

    return res.status(200).json(updatedRecipe);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
