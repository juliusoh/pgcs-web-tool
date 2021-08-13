import express from "express";
import asyncHandler from "express-async-handler";
import Coin from "../models/coin.js";

const router = express.Router();

// @desc Fetch All Coins by Full Name
// @route /api/coins
// @access Public
router.get(
  "/",
  asyncHandler(async (req, res) => {
    // get all coins distinct
    const categories = {};

    // later change add full name
    const coins = await Coin.aggregate([
      {
        $group: {
          _id: "$category",
          coins: {
            $addToSet: {
              subCategory: "$subCategory",
              fullName: "$fullName",
              coinName: "$coinName",
              specNo: "$specNo",
              id: "$_id",
              coinData: "$array"
            },
          },
        },
      },
    ]).allowDiskUse(true);
    coins.forEach((coin) => {
      const { _id, coins } = coin;
      categories[_id] = coins;
    });
    res.json(categories);
  })
);

// @desc Fetch Coin by Id
// @route /api/coins/:id
// @access Public
router.get(
  "/:specNo/:coinName",
  asyncHandler(async (req, res) => {
    const today = new Date(Date.now());
    today.setHours(0, 0, 0, 0);
    const todayCoin = await Coin.findOne({
      ...req.params,
      createdAt: {
        $gte: today,
      },
    }).lean();
    const startYest = new Date(Date.now());
    // hours, minutes, seconds, ms
    startYest.setHours(0, 0, 0, 0);
    const oneDayAgo = startYest.getDate() - 1;
    startYest.setDate(oneDayAgo);

    const endYest = new Date(Date.now());
    // hours, minutes, seconds, ms
    endYest.setHours(23, 59, 59);
    const endYestDayAgo = endYest.getDate() - 1;
    endYest.setDate(endYestDayAgo);
    // its between midnight yesterday and midnight today
    // startYest 12 AM to endYest 11:59PM;
    const yesterdayCoin = await Coin.findOne({
      ...req.params,
      createdAt: {
        $gte: startYest,
        $lt: endYest,
      },
    }).lean();
    //find one fix the deltemany script !

    const arrayYesterday = yesterdayCoin.array;
    const arrayToday = todayCoin.array;
    for (let i in arrayToday) {
      let trend = 0;
      if (!arrayYesterday[i]) {
        arrayToday[i].trend = trend;
        continue;
      }

      const todayPopCount = Number(arrayToday[i].PopulationCount || 0);
      const yesPopCount = Number(arrayYesterday[i].PopulationCount || 0);

      // console.log('yesterday', yesPopCount)
      // console.log('today', todayPopCount)

      trend = todayPopCount - yesPopCount;
      arrayToday[i].trend = trend;
    }

    todayCoin.array = arrayToday;

    if (todayCoin) {
      res.json(todayCoin);
    } else {
      res.status(404).json({ message: "Coin not found" });
    }
  })
);

export default router;
