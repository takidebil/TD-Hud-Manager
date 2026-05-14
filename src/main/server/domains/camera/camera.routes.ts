import { Router, Request, Response } from 'express'

const router = Router()

// Dummy camera endpoint to silence 404s from some HUDs
router.get('/', (_req: Request, res: Response) => {
  res.json([])
})

export default router
