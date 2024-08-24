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

export const getMemberById = async (req, res) => {
  try {
    const { id } = req.params

    const { data: member } = await supabase.from("members").select().eq("id", id).single()

    if (!member) {
      return res.status(404).json({ msg: "Member not found" })
    }

    res.status(200).json(member)
  } catch (error) {
    console.error(`Error fetching member: ${error}`)
    res.status(500).json({
      msg: "Internal server error",
      err: error.message
    })
  }
}

export const createMember = async (req, res) => {
  try {
    const { name, password, phone, balance } = req.body
    const hashPassword = await bcrypt.hash(password, saltRounds)

    const { data: newMember } = await supabase.from("members").insert({
      name,
      password: hashPassword,
      phone,
      balance,
      status: "active"
    }).select()

    res.status(201).json({ msg: `Created a member account with the name ${name} successfully`, member: newMember })
  } catch (error) {
    res.status(400).json({
      msg: `Failed to create a member account`,
      err: error.message
    })
  }
}