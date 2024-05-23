import mongoose from "mongoose";
import monggose, { Schema } from "mongoose";

monggose.connect(process.env.MONGOBD_URI);
monggose.Promise = global.Promise;

const staffSchema = new Schema(
  {
    staffID: String,
    name: String,
    lastname: String,
    email: String,
    tel: String,
  },
  { collection: "staff" }
);

const Staff = mongoose.models.Staff || mongoose.model("staff", staffSchema);
// const Staff =  mongoose.model("staff", staffSchema);

export default Staff;
