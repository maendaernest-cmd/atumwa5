import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Gig, ChatThread, WalletTransaction, Message, GigType, PaymentMethod } from '../types';
import { MOCK_USERS, MOCK_GIGS, MOCK_CHATS, WALLET_HISTORY, FEED_UPDATES } from '../constants';

interface AdminAction {
    id: string;
    adminId: string;
    action: string;
    targetId: string;
    targetType: 'user' | 'gig' | 'dispute' | 'setting';
    details: any;
    timestamp: string;
}

interface AdminSettings {
    platformFee: number;
    surgePricing: boolean;
    surgeMultiplier: number;
    serviceAreas: string[];
    minDeliveryPrice: number;
    maxDeliveryPrice: number;
}

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
    auditLog: AdminAction[];
    adminSettings: AdminSettings;

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
    
    // Admin Actions
    suspendUser: (userId: string, adminId: string, reason: string) => void;
    banUser: (userId: string, adminId: string, reason: string) => void;
    unsuspendUser: (userId: string, adminId: string) => void;
    logAdminAction: (adminId: string, action: string, targetId: string, targetType: 'user' | 'gig' | 'dispute' | 'setting', details: any) => void;
    updateAdminSettings: (settings: Partial<AdminSettings>) => void;
    updateUserRole: (userId: string, newRole: string, adminId: string) => void;
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
    const [auditLog, setAuditLog] = useState<AdminAction[]>([]);
    const [adminSettings, setAdminSettings] = useState<AdminSettings>({
        platformFee: 0.15,
        surgePricing: true,
        surgeMultiplier: 1.5,
        serviceAreas: ['Downtown', 'Suburbs', 'Airport'],
        minDeliveryPrice: 2.50,
        maxDeliveryPrice: 100.00
    });

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
        const savedAuditLog = localStorage.getItem('atumwa_audit_log');
        const savedSettings = localStorage.getItem('atumwa_admin_settings');

        if (savedGigs) setGigs(JSON.parse(savedGigs));
        if (savedUsers) setUsers(JSON.parse(savedUsers));
        if (savedChats) setChats(JSON.parse(savedChats));
        if (savedTickets) setSupportTickets(JSON.parse(savedTickets));
        if (savedAuditLog) setAuditLog(JSON.parse(savedAuditLog));
        if (savedSettings) setAdminSettings(JSON.parse(savedSettings));
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

    useEffect(() => {
        localStorage.setItem('atumwa_audit_log', JSON.stringify(auditLog));
    }, [auditLog]);

    useEffect(() => {
        localStorage.setItem('atumwa_admin_settings', JSON.stringify(adminSettings));
    }, [adminSettings]);


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

    const logAdminAction = (adminId: string, action: string, targetId: string, targetType: 'user' | 'gig' | 'dispute' | 'setting', details: any) => {
        const newAction: AdminAction = {
            id: `audit_${Date.now()}`,
            adminId,
            action,
            targetId,
            targetType,
            details,
            timestamp: new Date().toISOString()
        };
        setAuditLog(prev => [newAction, ...prev]);
    };

    const suspendUser = (userId: string, adminId: string, reason: string) => {
        setUsers(prev => prev.map(u => 
            u.id === userId ? { ...u, isSuspended: true, suspensionReason: reason } : u
        ));
        logAdminAction(adminId, 'suspend_user', userId, 'user', { reason });
    };

    const banUser = (userId: string, adminId: string, reason: string) => {
        setUsers(prev => prev.map(u => 
            u.id === userId ? { ...u, isBanned: true, banReason: reason } : u
        ));
        logAdminAction(adminId, 'ban_user', userId, 'user', { reason });
    };

    const unsuspendUser = (userId: string, adminId: string) => {
        setUsers(prev => prev.map(u => 
            u.id === userId ? { ...u, isSuspended: false, suspensionReason: undefined } : u
        ));
        logAdminAction(adminId, 'unsuspend_user', userId, 'user', {});
    };

    const updateAdminSettings = (settings: Partial<AdminSettings>) => {
        setAdminSettings(prev => ({ ...prev, ...settings }));
    };

    const updateUserRole = (userId: string, newRole: string, adminId: string) => {
        setUsers(prev => prev.map(u => 
            u.id === userId ? { ...u, role: newRole as any } : u
        ));
        logAdminAction(adminId, 'update_role', userId, 'user', { newRole });
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
            supportTickets,
            auditLog,
            adminSettings,
            addGig,
            updateGigStatus,
            assignGig,
            addMessage,
            markChatRead,
            updateUserLocation,
            verifyUser,
            broadcastInquiry,
            confirmPayment,
            createTicket,
            updateTicketStatus,
            sharedLocations,
            toggleGPSSharing,
            suspendUser,
            banUser,
            unsuspendUser,
            logAdminAction,
            updateAdminSettings,
            updateUserRole
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
