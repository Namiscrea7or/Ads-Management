const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BillboardSchema = new Schema({
    adsMarker: {
      type: Schema.Types.ObjectId,
      ref: "adsMarker",
    },
    type: {
      type: String,
      enum: ["HiflexPole", "LEDPanel", "LightBoxPole", "HiflexWall", "LEDWall", "BannerPoleVertical", "BannerPoleHorizontal", "BillboardGroup", "WelcomeGate", "CommercialCenter"],
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
  });
  
  module.exports = mongoose.model("Billboard", BillboardSchema);
  