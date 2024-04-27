'use server'
import { connectDB } from "@/config/db-config";
import UserModel from "@/models/user-model";
import { currentUser } from "@clerk/nextjs";

connectDB();

export const getCurrentUserfromMongoDB = async () => {
    try {
        const clerkUser = await currentUser();
        
        const user = await UserModel.findOne({ clerkUserId: clerkUser?.id });
        if (user) {
            return JSON.parse(JSON.stringify(user));
        }

        let email = "";
        if(clerkUser?.emailAddresses && clerkUser?.emailAddresses.length){
            email = clerkUser.emailAddresses[0].emailAddress;
        }


        const newPayload = {
            clerkUserId: clerkUser?.id,
            name: clerkUser?.firstName + " " + clerkUser?.lastName,
            userName: clerkUser?.username,
            email,
            profilePicture: clerkUser?.imageUrl
        }
        const newUser = await UserModel.create(newPayload);
        return JSON.parse(JSON.stringify(newUser));
    } catch (error: any) {
        return {
            error: error.message,
        }
    }
}

export const getAllUsers = async () => {
    try {
        const users = await UserModel.find();
        return JSON.parse(JSON.stringify(users));
    } catch (error: any) {
        return {
            error: error.message,
        }
    }
}


export const updateUserProfilePicture = async (userId: string, profilePicture: any) => {
    try {
        const user = await UserModel.findByIdAndUpdate(userId, profilePicture, { new: true });
        return JSON.parse(JSON.stringify(user));
    }
    catch (error: any) {
        return {
            error: error.message,
        }
    }
}