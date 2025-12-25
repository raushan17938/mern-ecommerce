import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { encrypt } from "../lib/encryption.js";

export const updateProfile = async (req, res) => {
    try {
        const { name, email, address } = req.body;
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = name || user.name;
            user.email = email || user.email;

            if (address) {
                user.address = {
                    street: encrypt(address.street),
                    city: encrypt(address.city),
                    state: encrypt(address.state),
                    postalCode: encrypt(address.postalCode),
                    country: encrypt(address.country),
                    phone: encrypt(address.phone),
                };
            }

            const updatedUser = await user.save();

            // We don't need to decrypt here because we are sending back what we just received (mostly),
            // but for consistency/correctness if we return the saved user, we should probably return the *decrypted* version
            // or just return the input data. However, the frontend expects the updated user object.
            // Let's return the unencrypted address from the request (since we know it) or decrypt the saved one.
            // Easier to just return the request address merged with existing.

            // Actually, let's just return the address as is from the request for the response, 
            // so the frontend sees the update immediately without needing decryption logic here (since we have the plain text).

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                address: address, // Return the plain address
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.log("Error in updateProfile controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (user && (await user.comparePassword(currentPassword))) {
            user.password = newPassword;
            await user.save();
            res.json({ message: "Password updated successfully" });
        } else {
            res.status(400).json({ message: "Invalid current password" });
        }
    } catch (error) {
        console.log("Error in updatePassword controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
