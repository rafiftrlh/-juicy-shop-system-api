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

export const getSystemUserById = async (req, res) => {
  try {
    const { id } = req.params

    const user = await supabase.from("system_users").select().eq("id", id).single()

    if (!user) {
      return res.status(404).json({ msg: "User not found" })
    }

    res.status(200).json(user.data)
  } catch (error) {
    console.error(`Error fetching user: ${error}`)
    res.status(500).json({
      msg: "Internal server error",
      err: error.message
    })
  }
}
