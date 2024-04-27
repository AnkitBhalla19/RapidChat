'use server'
import ChatModel from "@/models/chat-model";

export const createChat = async (chatData: any) => {
    try {
        await ChatModel.create(chatData);
        const chats = await ChatModel.find({ users: { $in: [chatData.createdBy] } }).populate('users').sort({ updatedAt: -1 });
        return JSON.parse(JSON.stringify(chats));
    } catch (error: any) {
        return {
            error: error.message,
        }
    }
}

export const getChats = async (userId: string) => {
    try {
        const users = await ChatModel.find({
            users: { $in: [userId] },
        }).populate('users').populate('createdBy').
            populate('LastMessage').populate({
                path: 'LastMessage',
                populate: {
                    path: 'sender',
                },
            }).sort({ lastMessageAt: -1 });
        return JSON.parse(JSON.stringify(users));
    } catch (error: any) {
        return {
            error: error.message,
        }
    }
}

export const UpdateChat = async ({ chatId, payload }: {
    chatId: string,
    payload: any
}) => {
    try {
        await ChatModel.findByIdAndUpdate(chatId, payload);
        return { message: 'Chat Updated Successfully' };
    }
    catch (error: any) {
        return {
            error: error.message,
        }
    }
}