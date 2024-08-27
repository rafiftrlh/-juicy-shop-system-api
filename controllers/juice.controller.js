import supabase from "../services/supabase_client.js"
import { v4 as uuidv4 } from 'uuid'

export const createJuice = async (req, res) => {
  try {
    const { name, price } = req.body
    const imageFile = req.file

    if (!name || !price || !imageFile) {
      return res.status(400).json({ msg: "Name, price, and image are required" })
    }

    const fileExt = imageFile.originalname.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `juices/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, imageFile.buffer, {
        contentType: imageFile.mimetype
      })

    if (uploadError) {
      throw new Error(`Failed to upload image: ${uploadError.message}`)
    }

    const { data: { publicUrl }, error: urlError } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    if (urlError) {
      throw new Error(`Failed to get public URL: ${urlError.message}`)
    }

    const { data, error: insertError } = await supabase
      .from("juices")
      .insert({
        name,
        price: parseFloat(price),
        image_url: publicUrl
      })
      .select()
      .single()

    if (insertError) {
      throw new Error(`Failed to create juice: ${insertError.message}`)
    }

    return res.status(201).json({
      msg: "Juice created successfully",
      data: data
    })

  } catch (error) {
    return res.status(500).json({
      msg: "Failed to create juice",
      err: error.message,
    })
  }
}

