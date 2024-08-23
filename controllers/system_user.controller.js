import supabase from "../services/supabase_client.js"

export const getAllSystemUser = async (req, res) => {
  try {
    const users = await supabase.from("system_users").select()

    res.status(200).json(users.data)
  } catch (error) {
    console.error("Error fetching users: ", error)
    res.status(500).json({
      msg: "Internal server error",
      err: error.message
    })
  }
}
