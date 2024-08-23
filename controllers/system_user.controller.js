import supabase from "../services/supabase_client.js"
import bcrypt from "bcrypt"

const saltRounds = 10

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

export const getAllStaff = async (req, res) => {
  try {
    const users = await supabase.from("system_users").select().not("role", "eq", "admin")

    res.status(200).json(users.data)
  } catch (error) {
    console.error(`Error fetching user: ${error}`)
    res.status(500).json({
      msg: "Internal server error",
      err: error.message
    })
  }
}

export const createStaff = async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    const hashPassword = await bcrypt.hash(password, saltRounds)

    if (role === "admin") {
      return res.status(400).json({ msg: "Role admin is not allowed for staff accounts." });
    }

    const newUser = await supabase.from("system_users").insert({
      name,
      email,
      password: hashPassword,
      role,
    }).select()

    res.status(201).json({ msg: `Created a staff account with the name ${name} successfully`, user: newUser.data })
  } catch (error) {
    res.status(400).json({
      msg: `Failed to create a staff account`,
      err: error.message
    })
  }
}

export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, password, role } = req.body

    const { data: existingUser, error: fetchError } = await supabase
      .from("system_users")
      .select()
      .eq("id", id)
      .single()

    if (fetchError || !existingUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    let updatedData = { name, email, role }
    if (password) {
      const hashPassword = await bcrypt.hash(password, saltRounds)
      updatedData.password = hashPassword
    }

    const updatedStaff = await supabase
      .from("system_users")
      .update(updatedData)
      .eq("id", id)

    res.status(200).json({
      msg: "Staff successfully updated",
      staff: updatedStaff[0],
    })
  } catch (error) {
    console.error(`Error updating staff: ${error}`)
    res.status(500).json({
      msg: "Failed to update staff",
      err: error.message,
    })
  }
}