import supabase from "../services/supabase_client.js"
import bcrypt from "bcrypt"

const saltRounds = 10

export const getAllMember = async (req, res) => {
  try {
    const { data: members } = await supabase.from("members").select().order('created_at', { ascending: true })

    res.status(200).json(members)
  } catch (error) {
    console.error("Error fetching members: ", error)
    res.status(500).json({
      msg: "Internal server error",
      err: error.message
    })
  }
}

