import { and, eq } from 'drizzle-orm' // Add this import
import express from 'express'
import { db } from './config/db.js'
import { ENV } from './config/env.js'
import { favoritesTable } from './db/schema.js'

const app = express()
const PORT = ENV.PORT

app.use(express.json())

// create a new favorite recipe
// POST /api/favorites

app.post('/api/favorites', async (req, res) => {
  try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body
    if (!userId || !recipeId || !title) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required fields' })
    }
    const newFavorite = await db
      .insert(favoritesTable)
      .values({
        userId,
        recipeId,
        title,
        image: image || null,
        cookTime: cookTime || null,
        servings: servings || null,
        createdAt: new Date(),
      })
      .returning()
    res.status(201).json({ success: true, data: newFavorite[0] })
  } catch (error) {
    console.error('Error in /api/favorites:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})
// delete a favorite recipe
// DELETE /api/favorites/:id
app.delete('/api/favorites/:userId/:recipeId', async (req, res) => {
  try {
    const { userId, recipeId } = req.params
    console.log('Deleting favorite for userId:', userId, 'recipeId:', recipeId)
    const deletedFavorite = await db
      .delete(favoritesTable)
      .where(
        and(
          eq(favoritesTable.userId, userId),
          eq(favoritesTable.recipeId, parseInt(recipeId, 10))
        )
      )
      .returning()
    console.log('Deleted favorite:', deletedFavorite)
    if (deletedFavorite.length === 0) {
      return res.status(404).json({ success: false, message: 'Not Found' })
    }
    res
      .status(200)
      .json({ success: true, message: 'Favorite deleted successfully' })
  } catch (error) {
    console.error('Error in /api/favorites/:userId/:recipeId:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})
// get all favorite recipes for a user
// GET /api/favorites/:userId
app.get('/api/favorites/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    console.log('Fetching favorites for userId:', userId)
    const favorites = await db
      .select()
      .from(favoritesTable)
      .where(eq(favoritesTable.userId, userId))
    console.log('Favorites found:', favorites)
    res.status(200).json({ success: true, data: favorites })
  } catch (error) {
    console.error('Error in /api/favorites/:userId:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
