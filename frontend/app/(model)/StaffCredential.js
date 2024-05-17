import mongoose from "mongoose";
import { Schema } from "mongoose";

mongoose.connect(process.env.MONGOBD_URI);
mongoose.Promise = global.Promise;

const staffCredentialSchema = new Schema(
  {
    staffID: String,
    role: String,
    password: String,
    username: String,
  },
  { collection: "credential" }
);

// const StaffCredential =
//   mongoose.models.StaffCredential ||
//   mongoose.model("credential", staffCredentialSchema);
const StaffCredential = mongoose.model("credential", staffCredentialSchema);

export default StaffCredential;
