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
        name: name,
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

export const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params
    const { changed_by } = req.body

    const { data: currentInventory, error: fetchError } = await supabase
      .from('inventory')
      .select()
      .eq('id', id)
      .single()

    if (fetchError || !currentInventory) {
      return res.status(404).json({ msg: "Item not found" })
    }

    const { error: logError } = await supabase
      .from('inventory_logs')
      .insert({
        name: currentInventory.name,
        quantity_changed: currentInventory.quantity,
        action: 'delete',
        reason: 'Inventory deleted',
        changed_by
      })

    if (logError) throw logError

    const { error: deleteError } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError

    return res.status(200).json({
      msg: "Item successfully delete from inventory "
    })

  } catch (error) {
    return res.status(500).json({
      msg: "Failed to delete an item from inventory",
      err: error.message,
    })
  }
}
