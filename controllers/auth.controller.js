import supabase from "../services/supabase_client.js"
import bcrypt from "bcrypt"

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" })
    }

    const { data: user, error } = await supabase
      .from("system_users")
      .select("id, name, email, password, role")
      .eq("email", email)
      .single()

    if (error || !user) {
      return res.status(404).json({ msg: "User not found" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Invalid password" })
    }

    delete user.password

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }

    res.status(200).json({
      msg: "Login successful",
      user: req.session.user
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ msg: "An error occurred during login", error: error.message })
  }
}