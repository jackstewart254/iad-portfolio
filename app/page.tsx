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

  const handleRecipeClick = (recipe: recipe) => {
    setSelectedRecipe(recipe);
    setOpen(true);
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
    const fetchData = async () => {
      const res = await fetch("/api/test");
      const data = await res.json();
      console.log(data);
    };

    fetchData();
  }, []);

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
      console.log(data);
    }
    fetchRecipes();
  }, []);

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

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] w-full pt-5 px-5 relative">
      <AlertDialog open={open}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold">
              {selectedRecipe?.name}
            </AlertDialogTitle>
          </AlertDialogHeader>

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

          <AlertDialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
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
      <div className="flex flex-col flex flex-row h-full overflow-y-auto flex-wrap flex-row gap-5 no-scrollbar py-5">
        {filteredRecipes.length > 0 ? filteredRecipes.map((recipe) => recipeItem(recipe)) : skelements.map((item, index) => <div key={index} className="w-[calc(25%-15px)] rounded-sm flex flex-col" style={{ height: filteredRecipes.length > 4 ? "auto" : "70%" }}>
          <Skeleton className="w-full h-full" />
        </div>)}
      </div>
    </div>
  );
}


