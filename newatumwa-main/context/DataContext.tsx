import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Gig, ChatThread, WalletTransaction, Message, GigType, PaymentMethod } from '../types';
import { MOCK_USERS, MOCK_GIGS, MOCK_CHATS, WALLET_HISTORY, FEED_UPDATES } from '../constants';

interface DataContextType {
    // State
    users: User[];
    gigs: Gig[];
    chats: ChatThread[];
    walletHistory: WalletTransaction[];
    feed: any[];
    inquiries: any[];
    exchangeRates: { usd_to_zig: number; zig_to_usd: number };
    supportTickets: any[];

    // Actions
    addGig: (gig: Gig) => void;
    updateGigStatus: (gigId: string, status: string, price?: number) => void;
    assignGig: (gigId: string, userId: string) => void;
    addMessage: (chatId: string, message: Message) => void;
    markChatRead: (chatId: string) => void;
    updateUserLocation: (userId: string, lat: number, lng: number) => void;
    verifyUser: (userId: string) => void;
    broadcastInquiry: (inquiry: any) => void;
    confirmPayment: (gigId: string, method: string) => void;
    createTicket: (ticket: any) => void;
    updateTicketStatus: (ticketId: string, status: string) => void;
    sharedLocations: Record<string, boolean>;
    toggleGPSSharing: (userId: string, active: boolean) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize state with MOCK data (Simulating Database Load)
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [gigs, setGigs] = useState<Gig[]>(MOCK_GIGS);
    const [chats, setChats] = useState<ChatThread[]>(MOCK_CHATS);
    const [walletHistory, setWalletHistory] = useState<WalletTransaction[]>(WALLET_HISTORY);
    const [feed, setFeed] = useState<any[]>(FEED_UPDATES);
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [supportTickets, setSupportTickets] = useState<any[]>([]);
    const [sharedLocations, setSharedLocations] = useState<Record<string, boolean>>({});

    // Global Industry Standard Rates (ZiG/USD)
    const [exchangeRates] = useState({
        usd_to_zig: 25.42, // Current Market Rate simulation
        zig_to_usd: 0.039
    });

    // Load from localStorage on mount (Persistence)
    useEffect(() => {
        const savedGigs = localStorage.getItem('atumwa_gigs');
        const savedUsers = localStorage.getItem('atumwa_users');
        const savedChats = localStorage.getItem('atumwa_chats');
        const savedTickets = localStorage.getItem('atumwa_tickets');

        if (savedGigs) setGigs(JSON.parse(savedGigs));
        if (savedUsers) setUsers(JSON.parse(savedUsers));
        if (savedChats) setChats(JSON.parse(savedChats));
        if (savedTickets) setSupportTickets(JSON.parse(savedTickets));
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

    useEffect(() => {
        localStorage.setItem('atumwa_tickets', JSON.stringify(supportTickets));
    }, [supportTickets]);


    // --- Actions ---

    const addGig = (gig: Gig) => {
        setGigs(prev => [gig, ...prev]);
        // Industry Standard: Feed Broadcast of new opportunities
        const feedEntry = {
            id: Date.now(),
            user: gig.postedBy,
            content: `📢 NEW GIG: ${gig.title} (${gig.locationStart} to ${gig.locationEnd}). ${gig.price} ${gig.paymentMethod === 'zig' ? 'ZiG' : 'USD'}`,
            time: 'Just now',
            type: 'gig_post',
            gigId: gig.id,
            likes: 0,
            comments: 0
        };
        setFeed(prev => [feedEntry, ...prev]);
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

    const broadcastInquiry = (inquiry: any) => {
        const newInquiry = {
            ...inquiry,
            id: `inq_${Date.now()}`,
            timestamp: new Date().toISOString(),
            status: 'unanswered'
        };
        setInquiries(prev => [newInquiry, ...prev]);

        // Push to Admin feed
        const adminLog = {
            id: Date.now() + 1,
            user: inquiry.user,
            content: `❓ Client asked about: "${inquiry.query}" at ${inquiry.place}`,
            time: 'Just now',
            type: 'announcement',
            likes: 0,
            comments: 0
        };
        setFeed(prev => [adminLog, ...prev]);
    };

    const confirmPayment = (gigId: string, method: string) => {
        // Industry Standard Payment release flow
        const gig = gigs.find(g => g.id === gigId);
        if (gig) {
            const transaction: WalletTransaction = {
                id: `tx_${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                amount: gig.price,
                type: 'credit',
                description: `Release for task: ${gig.title}`,
                status: 'completed',
                gigId: gig.id
            };
            setWalletHistory(prev => [transaction, ...prev]);
            updateGigStatus(gigId, 'completed');
        }
    };

    const createTicket = (ticket: any) => {
        const newTicket = {
            ...ticket,
            id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
            timestamp: new Date().toISOString(),
            status: 'open'
        };
        setSupportTickets(prev => [newTicket, ...prev]);

        // Push to admin feed for visibility
        const supportLog = {
            id: Date.now() + 5,
            user: ticket.sender,
            content: `🚨 NEW SUPPORT TICKET: ${ticket.subject} (${ticket.category})`,
            time: 'Just now',
            type: 'announcement',
            likes: 0,
            comments: 0
        };
        setFeed(prev => [supportLog, ...prev]);
    };

    const updateTicketStatus = (ticketId: string, status: string) => {
        setSupportTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
    };

    const toggleGPSSharing = (userId: string, active: boolean) => {
        setSharedLocations(prev => ({ ...prev, [userId]: active }));
        // Simulated Backend Broadcast: Notify relevant parties in the feed
        if (active) {
            const shareLog = {
                id: Date.now() + 10,
                user: users.find(u => u.id === userId),
                content: `📡 LIVE GPS: A messenger has started broadcasting their real-time location.`,
                time: 'Just now',
                type: 'announcement',
                likes: 0,
                comments: 0
            };
            setFeed(prev => [shareLog, ...prev]);
        }
    };

    return (
        <DataContext.Provider value={{
            users,
            gigs,
            chats,
            walletHistory,
            feed,
            inquiries,
            exchangeRates,
            addGig,
            updateGigStatus,
            assignGig,
            addMessage,
            markChatRead,
            updateUserLocation,
            verifyUser,
            broadcastInquiry,
            confirmPayment,
            supportTickets,
            createTicket,
            updateTicketStatus,
            sharedLocations,
            toggleGPSSharing
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
