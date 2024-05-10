export interface UserType{
    name: string;
    email: string;
    userName: string;
    profilePicture: string;
    clerkUserId: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface ChatType{
    _id: string;
    users: UserType[];
    createdBy: UserType;
    LastMessage: MessageType;
    isGroupChat: boolean;
    groupName: string;
    groupProfilePicture: string;
    groupBio: string;
    groupAdmins: UserType[];
    unreadCount: any;
    createdAt: string;
    updatedAt: string;
    lastMessageAt: string;
}

export interface MessageType{
    _id: string;
    socketMessageId: string;
    gifUrl: string;
    chat: ChatType;
    sender: UserType;
    text: string;
    image: string;
    readBy: any;
    createdAt: string;
    updatedAt: string;
}