import supabase from "../services/supabase_client.js"

export const createInventory = async (req, res) => {
  try {
    const { name, quantity, category_id, changed_by } = req.body

    const { data: inventoryData, error: inventoryError } = await supabase
      .from('inventory')
      .insert({ name, quantity, category_id })
      .select()
      .single()

    if (inventoryError) throw inventoryError

    const { error: logError } = await supabase
      .from('inventory_logs')
      .insert({
        inventory_id: inventoryData.id,
        quantity_changed: quantity,
        action: 'in',
        reason: 'Initial inventory',
        changed_by
      })

    if (logError) throw logError

    return res.status(201).json({
      msg: "Inventory created successfully",
      data: inventoryData
    })

  } catch (error) {
    console.error('Caught error:', error)
    return res.status(500).json({
      msg: "Failed to create inventory",
      err: error.message,
    })
  }
}
