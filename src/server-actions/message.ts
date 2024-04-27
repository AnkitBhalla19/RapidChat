'use server'
import ChatModel from "@/models/chat-model"
import MessageModel from "@/models/message-model"


export const sendMessage = async (payload: {
    chat: string,
    sender: string,
    text?: string,
    image?: string,
    readBy?: string[],
}) => {
    try {
        const newMessage = new MessageModel(payload);
        await newMessage.save();

        const existingChat = await ChatModel.findById(payload.chat);
        const existingUnreadCounts = existingChat?.unreadCount;
        
        existingChat?.users.forEach((user: any) => {
            const userIdString = user.toString();
            if (userIdString !== payload.sender) {
                existingUnreadCounts[userIdString] = (existingUnreadCounts[userIdString] || 0) + 1;
            }
        });
        await ChatModel.findByIdAndUpdate(payload.chat, {
            LastMessage: newMessage._id,
            unreadCount: existingUnreadCounts,
            lastMessageAt:new Date().toISOString()
        });
        return { message: "Message Sent Successfully" }

    } catch (error: any) {
        return { error: error.message }
    }
}

export const getChatMessages = async (chatId: string) => {
    try {
        const messages = await MessageModel.find({ chat: chatId }).populate('sender').sort({ createdAt: 1 });
        return JSON.parse(JSON.stringify(messages));
    } catch (error: any) {
        return { error: error.message }
    }
}

export const ReadAllMessages = async ({
    chatId,
    userId,
  }: {
    chatId: string;
    userId: string;
  }) => {
    try {
      await MessageModel.updateMany(
        {
          chat: chatId,
          sender: { $ne: userId },
          readBy: {
            $nin: [userId],
          },
        },
        { $addToSet: { readBy: userId } }
      );
  
      const existingChat = await ChatModel.findById(chatId);
      const existingUnreadCounts = existingChat?.unreadCount;
      const newUnreadCounts = { ...existingUnreadCounts, [userId]: 0 };
      await ChatModel.findByIdAndUpdate(chatId, {
        unreadCount: newUnreadCounts,
      });
  
      return { message: "Messages marked as read" };
    } catch (error: any) {
      return { error: error.message };
    }
  };


