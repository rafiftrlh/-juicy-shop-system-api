import supabase from "../services/supabase_client.js"
import { checkJuiceAvailability } from "./juice.controller.js"

export const createJuiceIngredient = async (req, res) => {
  try {
    const { juice_id, inventory_id, quantity } = req.body

    if (!juice_id || !inventory_id || !quantity) {
      return res.status(400).json({ msg: "Juice ID, Inventory ID, and Quantity are required" })
    }

    const { data, error } = await supabase
      .from("juice_ingredients")
      .insert({ juice_id, inventory_id, quantity })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create juice ingredient: ${error.message}`)
    }

    await checkJuiceAvailability(juice_id)

    return res.status(201).json({
      msg: "Juice ingredient created successfully",
      data: data
    })

  } catch (error) {
    console.error('Caught error:', error)
    return res.status(500).json({
      msg: "Failed to create juice ingredient",
      err: error.message,
    })
  }
}
