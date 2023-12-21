const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adsMarkerSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  area: {
    ward: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
  },
  locationType: {
    type: String,
    enum: ["PublicLand", "PrivateLand", "CommercialCenter", "Market", "GasStation", "BusStop"],
    required: true,
  },
  adType: {
    type: String,
    enum: ["PoliticalCampaign", "CommercialAdvertising", "SocialCampaign"],
    required: true,
  },
  image: {
    type: String, 
    required: true,
  },
  planningStatus: {
    type: Boolean,
    required: true,
  },
  billboards: [
    {
      type: Schema.Types.ObjectId,
      ref: "Billboard",
    },
  ],
});

module.exports = mongoose.model("adsMarker", adsMarkerSchema);
