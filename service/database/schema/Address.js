const mongoose = require('mongoose') // 引入Mongoose
const Schema = mongoose.Schema // 声明Schema

const addressSchema = new Schema({
  ID: { unique: true, type: String },
  USER_ID: { type: String },
  USER_NAME: { type: String },
  USER_TEL: { type: String },
  ADDRESS_PROVINCE: { type: String },
  ADDRESS_CIITY: { type: String },
  ADDRESS_COUNTY: { type: String },
  ADDRESS_DETAIL: { type: String },
  AREA_CODE: { type: String },
  POSTAL_CODE: { type: String },
  IS_DEFAULT: { type: Boolean }
})

mongoose.model('Address', addressSchema)
