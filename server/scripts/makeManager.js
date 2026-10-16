
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const User = require("../models/User");

async function makeManager() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const email = process.argv[2]?.toLowerCase();

    if (!email) {
      console.log(
        'Usage: node scripts/makeManager.js "testcustomer@example.com"'
      );
      return;
    }

    const user = await User.findOneAndUpdate(
      { email },
      { $set: { role: "manager" } },
      { new: true, runValidators: true }
    );

    if (!user) {
      console.log("User not found. Register this account first.");
      return;
    }

    console.log(`Manager role assigned to: ${user.email}`);
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

makeManager();