import mongoose from "mongoose";

const coinSchema = mongoose.Schema(
  {
    specNo: {
      type: String,
      required: true,
    },
    coinName: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      default: ""
    },
    category: {
      type: String,
    },
    array: [
      {
        GradeName: String,
        PopulationCount: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Coin = mongoose.model("Coins", coinSchema);

export default Coin;
