import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Gig, ChatThread, WalletTransaction, Message, GigType, PaymentMethod } from '../types';
import { MOCK_USERS, MOCK_GIGS, MOCK_CHATS, WALLET_HISTORY, FEED_UPDATES } from '../constants';

interface DataContextType {
    // Data
    users: User[];
    gigs: Gig[];
    chats: ChatThread[];
    walletHistory: WalletTransaction[];
    feed: any[];

    // Actions
    addGig: (gig: Gig) => void;
    updateGigStatus: (gigId: string, status: string, price?: number) => void;
    assignGig: (gigId: string, userId: string) => void;
    addMessage: (chatId: string, message: Message) => void;
    markChatRead: (chatId: string) => void;
    updateUserLocation: (userId: string, lat: number, lng: number) => void;
    verifyUser: (userId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize state with MOCK data (Simulating Database Load)
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [gigs, setGigs] = useState<Gig[]>(MOCK_GIGS);
    const [chats, setChats] = useState<ChatThread[]>(MOCK_CHATS);
    const [walletHistory, setWalletHistory] = useState<WalletTransaction[]>(WALLET_HISTORY);
    const [feed, setFeed] = useState<any[]>(FEED_UPDATES);

    // Load from localStorage on mount (Persistence)
    useEffect(() => {
        const savedGigs = localStorage.getItem('atumwa_gigs');
        const savedUsers = localStorage.getItem('atumwa_users');
        const savedChats = localStorage.getItem('atumwa_chats');

        if (savedGigs) setGigs(JSON.parse(savedGigs));
        if (savedUsers) setUsers(JSON.parse(savedUsers));
        if (savedChats) setChats(JSON.parse(savedChats));
    }, []);

    // Save to localStorage whenever state changes
    useEffect(() => {
        localStorage.setItem('atumwa_gigs', JSON.stringify(gigs));
    }, [gigs]);

    useEffect(() => {
        localStorage.setItem('atumwa_users', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem('atumwa_chats', JSON.stringify(chats));
    }, [chats]);


    // --- Actions ---

    const addGig = (gig: Gig) => {
        setGigs(prev => [gig, ...prev]);
        // Also add to feed ideally
    };

    const updateGigStatus = (gigId: string, status: string, price?: number) => {
        setGigs(prev => prev.map(g => {
            if (g.id === gigId) {
                return {
                    ...g,
                    status: status as any, // Type casting for simplicity here
                    price: price !== undefined ? price : g.price,
                    completedAt: status === 'completed' ? new Date().toISOString() : g.completedAt
                };
            }
            return g;
        }));
    };

    const assignGig = (gigId: string, userId: string) => {
        setGigs(prev => prev.map(g => {
            if (g.id === gigId) {
                return {
                    ...g,
                    assignedTo: userId,
                    status: 'in-progress',
                    assignedAt: new Date().toISOString()
                };
            }
            return g;
        }));
    };

    const addMessage = (chatId: string, message: Message) => {
        setChats(prev => {
            const existingChat = prev.find(c => c.id === chatId);
            if (existingChat) {
                // Update existing thread
                const updatedChats = prev.map(c => {
                    if (c.id === chatId) {
                        return {
                            ...c,
                            lastMessage: message.text,
                            lastMessageTime: message.timestamp,
                            unreadCount: message.senderId === 'current_user' ? c.unreadCount : c.unreadCount + 1
                        };
                    }
                    return c;
                });
                // Sort by recent
                return updatedChats.sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
            } else {
                // If chat doesn't exist (shouldn't happen with strict ID, but for safety in simulation)
                // We would need to create it, but we need participant info. 
                // For now, assume chat exists or was created via navigation state in Messages.tsx
                return prev;
            }
        });
    };

    const markChatRead = (chatId: string) => {
        setChats(prev => prev.map(c => c.id === chatId ? { ...c, unreadCount: 0 } : c));
    };

    const updateUserLocation = (userId: string, lat: number, lng: number) => {
        setUsers(prev => prev.map(u => {
            if (u.id === userId) {
                return { ...u, locationCoordinates: { lat, lng } };
            }
            return u;
        }));
    };

    const verifyUser = (userId: string) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isVerified: true } : u));
    };

    return (
        <DataContext.Provider value={{
            users,
            gigs,
            chats,
            walletHistory,
            feed,
            addGig,
            updateGigStatus,
            assignGig,
            addMessage,
            markChatRead,
            updateUserLocation,
            verifyUser
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
