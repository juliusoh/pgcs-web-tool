import express from "express";
import asyncHandler from "express-async-handler";
import Coin from '../models/coin.js';

const router = express.Router();

// @desc Fetch All Coins
// @route /api/coins
// @access Public
router.get(
  "/",
  asyncHandler(async (req, res) => {
   const coins = await Coin.aggregate([{
     "$group": {
       "_id":"$category",
       "coins": {
         $push: "$$ROOT"
       }
     }
   }])

   res.json(coins)
  })
);

// @desc Fetch Coin by Id
// @route /api/coins/:id
// @access Public
router.get("/:id", asyncHandler (async(req, res) => {
  const coin = await Coin.findById(req.params.id)
  if (coin) {
    res.json(coin)
  } else {
    res.status(404).json({ message: 'Coin not found'})
  }

}));

export default router;
