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