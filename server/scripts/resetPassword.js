require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function resetPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const email = process.argv[2]?.toLowerCase();
    const newPassword = process.argv[3];

    if (!email || !newPassword) {
      console.log('Usage: node scripts/resetPassword.js "email@example.com" "newpassword"');
      return;
    }

    if (newPassword.length < 8) {
      console.log("Password must be at least 8 characters.");
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const user = await User.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    if (!user) {
      console.log("User not found.");
      return;
    }

    console.log(`✅ Password reset successfully for: ${user.email} (role: ${user.role})`);
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

resetPassword();
