"use client";
import { useEffect, useState } from "react";
import { user, recipe } from "../app/generated/prisma";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useGlobal } from "@/context/global";
import { Loader2 } from "lucide-react";


export default function Home() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recipes, setRecipes] = useState<recipe[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<recipe | null>(null);
  const [filteredRecipes, setFilteredRecipes] = useState<recipe[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [search, setSearch] = useState<string>("");
  const [skelements, setSkelements] = useState<number[]>([1, 2, 3, 4, 5]);
  const [showEditRecipeSheet, setShowEditRecipeSheet] = useState<boolean>(false);
  const [editRecipe, setEditRecipe] = useState<recipe>({
    rid: selectedRecipe?.rid || 0,
    uid: selectedRecipe?.uid || 1,
    name: selectedRecipe?.name || "",
    description: selectedRecipe?.description || "",
    image: selectedRecipe?.image || "",
    type: selectedRecipe?.type || "Italian",
    cookingtime: selectedRecipe?.cookingtime || 0,
    ingredients: selectedRecipe?.ingredients || "",
    instructions: selectedRecipe?.instructions || "",
  });
  const [refreshRecipes, setRefreshRecipes] = useState<boolean>(false);
  const [loadingInsert, setLoadingInsert] = useState<boolean>(false);

  const { global, setGlobal } = useGlobal();
  const { user, loggedIn } = global;

  const handleRecipeClick = (recipe: recipe) => {
    if (loggedIn && recipe.uid === user.uid) {
      setEditRecipe(recipe);
      setShowEditRecipeSheet(true);
      setOpen(true);
      setSelectedRecipe(recipe)
    } else {
      setSelectedRecipe(recipe);
      setOpen(true);
    }
  }

  const handleSearchChange = (value: string) => {
    setSearch(value);
  }

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);

    if (value === "All") {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter((recipe) => recipe.type === value);
      setFilteredRecipes(filtered);
    }
  };

  useEffect(() => {
    setFilteredRecipes(recipes);
  }, [recipes]);

  useEffect(() => {
    const filtered = recipes.filter((recipe) => recipe.name.toLowerCase().includes(search.toLowerCase()));
    setFilteredRecipes(filtered);
  }, [search]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const res = await fetch("/api/recipes");
      const data = await res.json();
      setRecipes(data);
    }
    fetchRecipes();
  }, [refreshRecipes]);

  const recipeItem = (recipe: recipe) => {
    return (
      <div key={recipe.rid} className="w-[calc(25%-15px)] p-5 rounded-sm border flex flex-col gap-2 hover:bg-[#F4F4F4] dark:hover:bg-[#1C1C1C] button-div" style={{ height: filteredRecipes.length > 4 ? "auto" : "70%" }} onClick={() => { handleRecipeClick(recipe) }}>
        <div className="w-full flex flex-row justify-between items-center">
          <h3 className="text-lg font-medium">{recipe.name}</h3>
          <p className="text-sm text-muted-foreground">{recipe.type}</p>
        </div>
        <p className="text-sm text-muted-foreground">{recipe.description}</p>
        <p className="text-sm text-muted-foreground">{recipe.cookingtime} minutes</p>
        <p className="text-sm text-muted-foreground">{recipe.ingredients.length} ingredients</p>
        <p className="text-sm text-muted-foreground">{recipe.instructions.length} instructions</p>
        <img src={recipe.image} alt={recipe.name} className="w-full h-full object-fit border border-white" />
      </div>
    );
  }

  const handleChange = (field: string, value: string | number) => {
    setEditRecipe((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  const editRecipeSheet = () => {
    return (
      <div className="space-y-4">
        <Input
          value={editRecipe.image}
          onChange={(e) => handleChange("image", e.target.value)}
          placeholder="Image URL"
        />

        <Select
          value={editRecipe.type}
          onValueChange={(value) => handleChange("type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {["Italian", "Indian", "French", "Chinese", "Mexican", "others"].map(
              (t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

        <Input
          type="number"
          value={editRecipe.cookingtime}
          onChange={(e) => handleChange("cookingtime", parseInt(e.target.value))}
          placeholder="Cooking time in minutes"
        />

        <Textarea
          value={editRecipe.ingredients}
          onChange={(e) => handleChange("ingredients", e.target.value)}
          placeholder="Comma-separated ingredients"
        />

        <Textarea
          value={editRecipe.instructions}
          onChange={(e) => handleChange("instructions", e.target.value)}
          placeholder="Line-separated instructions"
        />
      </div>
    )
  }

  const recipeSheet = () => {
    return (
      <div className="space-y-4">
        {selectedRecipe?.image && (
          <img
            src={selectedRecipe.image}
            alt={selectedRecipe.name}
            className="w-full h-32 object-cover rounded-md border"
          />
        )}

        <p className="text-sm text-muted-foreground">
          <span className="font-semibold">Type:</span> {selectedRecipe?.type}
        </p>

        <p className="text-sm text-muted-foreground">
          <span className="font-semibold">Cooking Time:</span>{" "}
          {selectedRecipe?.cookingtime} minutes
        </p>

        <div>
          <h4 className="font-semibold text-sm mb-1">Ingredients</h4>
          <ul className="list-disc list-inside text-sm">
            {Array.isArray(selectedRecipe?.ingredients)
              ? selectedRecipe.ingredients.map((item, index) => (
                <li key={index}>{item}</li>
              ))
              : selectedRecipe?.ingredients?.split(",").map((item, index) => (
                <li key={index}>{item.trim()}</li>
              ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-1">Instructions</h4>
          <ol className="list-decimal list-inside text-sm space-y-1">
            {Array.isArray(selectedRecipe?.instructions)
              ? selectedRecipe.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))
              : selectedRecipe?.instructions?.split("\n").map((step, index) => (
                <li key={index}>{step.trim()}</li>
              ))}
          </ol>
        </div>
      </div>
    )
  }

  const submitRecipeValidation = (recipe: typeof editRecipe): { valid: boolean; error?: string } => {
    if (!recipe.name.trim()) return { valid: false, error: "Name is required." };
    if (!recipe.type.trim()) return { valid: false, error: "Type is required." };
    if (!recipe.cookingtime || recipe.cookingtime <= 0)
      return { valid: false, error: "Cooking time must be a positive number." };
    if (!recipe.ingredients.trim()) return { valid: false, error: "Ingredients are required." };
    if (!recipe.instructions.trim()) return { valid: false, error: "Instructions are required." };
    if (!recipe.image.trim()) return { valid: false, error: "Image URL is required." };

    return { valid: true };
  };

  const handleSubmit = async (uid: number) => {
    const result = submitRecipeValidation(editRecipe);
    setLoadingInsert(true);

    if (!result.valid) {
      alert(result.error);
      return;
    }

    // const { name, description, type, cookingtime, ingredients, instructions, image, uid } = req.body;

    if (uid === user.uid) {
      try {
        const res = await fetch("/api/recipes", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editRecipe), // or construct the body manually
        });

        if (!res.ok) throw new Error("Failed to update recipe.");

        const updated = await res.json();
        setRecipes((prev) =>
          prev.map((recipe) =>
            recipe.rid === updated.rid ? updated : recipe
          )
        );
        setOpen(false);
      } catch (error) {
        console.error("❌ Error updating recipe:", error);
        // optionally show error to user
      }
    } else {
      try {
        const res = await fetch("/api/recipes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: editRecipe.name, description: editRecipe.description, type: editRecipe.type, cookingtime: editRecipe.cookingtime, ingredients: editRecipe.ingredients, instructions: editRecipe.instructions, image: editRecipe.image, uid: user.uid }),
        });

        if (!res.ok) throw new Error("Failed to submit recipe.");

        setLoadingInsert(false);
        setRefreshRecipes(true);
        setShowEditRecipeSheet(false);
        setEditRecipe({
          rid: selectedRecipe?.rid || 0,
          uid: selectedRecipe?.uid || 1,
          name: selectedRecipe?.name || "",
          description: selectedRecipe?.description || "",
          image: selectedRecipe?.image || "",
          type: selectedRecipe?.type || "Italian",
          cookingtime: selectedRecipe?.cookingtime || 0,
          ingredients: selectedRecipe?.ingredients || "",
          instructions: selectedRecipe?.instructions || "",
        })
        setOpen(false);


      } catch (err) {
        console.error(err);
        alert("Something went wrong.");
      }
    }
  };



  return (
    <div className="flex flex-col h-[calc(100vh-60px)] w-full pt-5 px-5 relative">
      <AlertDialog open={open}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold" >
              {showEditRecipeSheet === true ? (
                <Input
                  value={editRecipe.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Recipe name"
                />
              ) : selectedRecipe?.name}
            </AlertDialogTitle>
          </AlertDialogHeader>

          {showEditRecipeSheet === true ? editRecipeSheet() : recipeSheet()}

          <AlertDialogFooter>
            <Button
              onClick={() => {
                handleSubmit(selectedRecipe?.uid);
              }}
            >
              {loggedIn ? selectedRecipe?.uid === user.uid ? loadingInsert ? <Loader2 /> : "Update" : loadingInsert ? <Loader2 /> : "Add Recipe" : "Add Recipe"}
            </Button>
            <Button variant="ghost" onClick={() => {
              setOpen(false); setShowEditRecipeSheet(false); setEditRecipe({
                rid: 0,
                uid: 1,
                name: "",
                description: "",
                image: "",
                type: "others",
                cookingtime: 0,
                ingredients: "",
                instructions: "",
              })
            }}>
              Close
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="flex flex-row justify-between items-center mb-5">
        <h2 className="text-lg font-medium">Our recipes</h2>
        <div className="flex flex-row gap-5">
          <Input type="text" placeholder="Search" onChange={(e) => { handleSearchChange(e.target.value) }} />
          <Select onValueChange={handleFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Italian">Italian</SelectItem>
              <SelectItem value="Indian">Indian</SelectItem>
              <SelectItem value="French">French</SelectItem>
              <SelectItem value="Chinese">Chinese</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="w-full h-[1px] bg-[#E4E4E7] dark:bg-[#252626]" />
      <div className="flex flex-row h-full overflow-y-auto flex-wrap gap-5 no-scrollbar py-5 relative">
        {loggedIn === true && < div className="fixed bottom-5 right-5 z-10">
          <Button onClick={() => { setOpen(true); setShowEditRecipeSheet(true) }}>Add Recipe</Button>
        </div>}
        {filteredRecipes.length > 0 ? filteredRecipes.map((recipe) => recipeItem(recipe)) : skelements.map((item, index) => <div key={index} className="w-[calc(25%-15px)] rounded-sm flex flex-col" style={{ height: filteredRecipes.length > 4 ? "auto" : "70%" }}>
          <Skeleton className="w-full h-full" />
        </div>)}
      </div>
    </div >
  );
}


