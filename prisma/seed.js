// prisma/seed.ts
import { PrismaClient } from "../app/generated/prisma/index.js";
const prisma = new PrismaClient();

async function main() {
    const user1 = await prisma.user.create({
        data: {
            username: "john",
            email: "john@example.com",
            password: "hashedpassword123",
        },
    });

    const user2 = await prisma.user.create({
        data: {
            username: "jane",
            email: "jane@example.com",
            password: "hashedpassword456",
        },
    });

    const recipes = [
        {
            name: "Classic Margherita Pizza",
            description: "A traditional Italian pizza with fresh tomatoes, mozzarella, and basil",
            type: "Italian",
            cookingtime: 30,
            ingredients: [
                "Pizza dough", "tomatoes", "fresh mozzarella", "basil leaves", "olive oil", "salt",
            ],
            instructions: [
                "Preheat oven to 475°F",
                "Roll out dough",
                "Add toppings",
                "Bake for 12-15 minutes",
            ],
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Pizza_Margherita_stu_spivack.jpg/1200px-Pizza_Margherita_stu_spivack.jpg",
            uid: user1.uid,
        },
        {
            name: "Chicken Tikka Masala",
            description: "Creamy Indian curry with marinated chicken pieces",
            type: "Indian",
            cookingtime: 45,
            ingredients: [
                "Chicken breast", "yogurt", "garam masala", "garlic", "ginger", "tomatoes", "cream",
            ],
            instructions: [
                "Marinate chicken",
                "Grill chicken",
                "Prepare sauce",
                "Combine and simmer",
            ],
            image: "https://www.seriouseats.com/thmb/DbQHUK2yNCALBnZE-H1M2AKLkok=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/chicken-tikka-masala-for-the-grill-recipe-hero-2_1-cb493f49e30140efbffec162d5f2d1d7.JPG",
            uid: user1.uid,
        },
        {
            name: "Beef Bourguignon",
            description: "Classic French beef stew cooked in red wine",
            type: "French",
            cookingtime: 180,
            ingredients: [
                "Beef chuck", "red wine", "carrots", "onions", "mushrooms", "bacon", "beef stock",
            ],
            instructions: [
                "Brown beef",
                "Sauté vegetables",
                "Add wine and stock",
                "Slow cook for 3 hours",
            ],
            image: "https://ichef.bbc.co.uk/ace/standard/1600/food/recipes/boeuf_bourguignon_25475_16x9.jpg.webp",
            uid: user1.uid,
        },
        {
            name: "Vegetable Pad Thai",
            description: "Stir-fried rice noodles with vegetables and peanuts",
            type: "Chinese",
            cookingtime: 25,
            ingredients: [
                "Rice noodles", "tofu", "bean sprouts", "peanuts", "eggs", "tamarind sauce",
            ],
            instructions: [
                "Soak noodles",
                "Stir-fry vegetables",
                "Add sauce",
                "Top with peanuts",
            ],
            image: "https://embed.widencdn.net/img/beef/rvod6zgtem/1120x840px/thai-braised-beef-shanks-and-fresh-pickled-vegetable-salad-horizontal.tif?keep=c&u=7fueml",
            uid: user1.uid,
        },
        {
            name: "Chocolate Lava Cake",
            description: "Warm chocolate cake with a molten center",
            type: "Italian",
            cookingtime: 20,
            ingredients: [
                "Dark chocolate", "butter", "eggs", "sugar", "flour",
            ],
            instructions: [
                "Melt chocolate",
                "Mix ingredients",
                "Bake at 425°F",
                "Serve warm",
            ],
            image: "https://www.melskitchencafe.com/wp-content/uploads/2023/01/updated-lava-cakes7.jpg",
            uid: user1.uid,
        },
    ];

    for (const recipe of recipes) {
        await prisma.recipe.create({ data: recipe });
    }
}

main()
    .then(() => {
        console.log("🌱 Seeding complete");
        return prisma.$disconnect();
    })
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });
