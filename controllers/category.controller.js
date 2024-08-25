import supabase from "../services/supabase_client.js"

export const getAllCategory = async (req, res) => {
  try {
    const { data: categories } = await supabase.from("categories").select().order('created_at', { ascending: true })

    res.status(200).json({ categories })
  } catch (error) {
    console.error("Error fetching categories: ", error)
    res.status(500).json({
      msg: "Internal server error",
      err: error.message
    })
  }
}

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params

    const { data: category } = await supabase.from("categories").select().eq("id", id).single()

    if (!category) {
      return res.status(404).json({ msg: "Category not found" })
    }

    res.status(200).json(category)
  } catch (error) {
    console.error(`Error fetching category: ${error}`)
    res.status(500).json({
      msg: "Internal server error",
      err: error.message
    })
  }
}

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body

    const { data: newCategory } = await supabase.from("categories").insert({ name }).select()

    res.status(201).json({ msg: `Created a category with the name ${name} successfully`, category: newCategory })
  } catch (error) {
    res.status(400).json({
      msg: `Failed to create a category`,
      err: error.message
    })
  }
}

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body

    const { data: existingCategory, error: fetchError } = await supabase
      .from("categories")
      .select()
      .eq("id", id)
      .single()

    if (fetchError || !existingCategory) {
      return res.status(404).json({ msg: "Category not found" });
    }

    let updatedData = { name }

    const { data: updatedCategory } = await supabase
      .from("categories")
      .update(updatedData)
      .eq("id", id)
      .select("name")

    res.status(200).json({
      msg: "Category successfully updated",
      category: updatedCategory,
    })
  } catch (error) {
    console.error(`Error updating category: ${error}`)
    res.status(500).json({
      msg: "Failed to update category",
      err: error.message,
    })
  }
}
