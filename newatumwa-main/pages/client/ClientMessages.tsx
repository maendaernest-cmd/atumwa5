import React, { useState, useEffect } from 'react';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { 
  MagnifyingGlassIcon, 
  PaperAirplaneIcon, 
  FaceSmileIcon, 
  PaperClipIcon,
  EllipsisHorizontalIcon,
  PhoneIcon,
  VideoCameraIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const contacts = [
  { id: 1, name: 'Tinashe M. (Worker)', role: 'Current Job', lastMessage: 'I am on my way with the tools.', time: '10:45 AM', unread: 2, online: true, avatar: 'TM' },
  { id: 2, name: 'Blessing C. (Worker)', role: 'Previous Job', lastMessage: 'The kitchen is sparkling clean now!', time: 'Yesterday', unread: 0, online: false, avatar: 'BC' },
  { id: 3, name: 'John D. (Worker)', role: 'Previous Job', lastMessage: 'I have picked up your groceries.', time: 'Dec 22', unread: 0, online: true, avatar: 'JD' },
];

const initialMessages = [
  { id: 1, senderId: 'worker', text: 'Hello! I am ready to start the task.', time: '9:00 AM' },
  { id: 2, senderId: 'client', text: 'Great! The keys are under the mat as discussed.', time: '9:05 AM' },
];

export default function ClientMessages() {
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(`chat_${selectedContact.id}`);
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      setMessages(initialMessages);
    }
  }, [selectedContact]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const msg = {
      id: Date.now(),
      senderId: 'client',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const updatedMessages = [...messages, msg];
    setMessages(updatedMessages);
    localStorage.setItem(`chat_${selectedContact.id}`, JSON.stringify(updatedMessages));
    setNewMessage('');
  };

  return (
    <DashboardShell role="client">
      <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
        {/* Contact List */}
        <div className="w-full md:w-80 border-r border-slate-50 flex flex-col h-1/2 md:h-full">
          <div className="p-6 border-b border-slate-50 bg-slate-50/30">
            <h2 className="text-xl font-black text-slate-900 mb-4 tracking-tight uppercase italic font-display">Messages</h2>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search chats..." 
                className="w-full pl-9 pr-4 py-2.5 bg-white border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-brand-600/20 shadow-sm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {contacts.map((contact) => (
              <button 
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`w-full flex items-center p-4 transition-all border-l-4 ${
                  selectedContact.id === contact.id ? 'bg-brand-50/50 border-brand-600' : 'border-transparent hover:bg-slate-50'
                }`}
              >
                <div className="relative mr-4">
                  <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 text-sm border border-white shadow-sm">
                    {contact.avatar}
                  </div>
                  {contact.online && (
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-brand-500 rounded-full border-2 border-white shadow-sm shadow-brand-500/50"></div>
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-sm font-black text-slate-900 truncate">{contact.name}</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{contact.time}</span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 truncate leading-tight">{contact.lastMessage}</p>
                </div>
                {contact.unread > 0 && (
                  <div className="ml-2 h-5 w-5 bg-brand-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-600/20">
                    <span className="text-[10px] font-black text-white">{contact.unread}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50/30 h-1/2 md:h-full">
          {/* Chat Header */}
          <div className="p-4 bg-white border-b border-slate-50 flex items-center justify-between shadow-sm">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 text-xs mr-3 border border-white shadow-sm">
                {selectedContact.avatar}
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">{selectedContact.name}</h3>
                <div className="flex items-center">
                  <div className={`h-1.5 w-1.5 rounded-full mr-1.5 ${selectedContact.online ? 'bg-brand-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]' : 'bg-slate-300'}`}></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {selectedContact.online ? 'Online Now' : 'Last seen 2h ago'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all active:scale-90">
                <PhoneIcon className="h-5 w-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all active:scale-90">
                <VideoCameraIcon className="h-5 w-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all active:scale-90">
                <EllipsisHorizontalIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            <div className="flex justify-center">
              <span className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
                Secure encrypted communication
              </span>
            </div>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.senderId === 'client' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] group ${msg.senderId === 'client' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 rounded-2xl text-sm font-medium shadow-sm leading-relaxed ${msg.senderId === 'client' 
                    ? 'bg-brand-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-900 rounded-tl-none border border-slate-100'
                  }`}>
                    {msg.text}
                  </div>
                  <div className={`flex items-center mt-1.5 space-x-1.5 ${msg.senderId === 'client' ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{msg.time}</span>
                    {msg.senderId === 'client' && <CheckCircleIcon className="h-3.5 w-3.5 text-brand-500" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-6 bg-white border-t border-slate-50">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
              <button type="button" className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all active:scale-90">
                <PaperClipIcon className="h-6 w-6" />
              </button>
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..." 
                  className="w-full pl-5 pr-12 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-600/20 transition-all outline-none"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-900 transition-all active:scale-90">
                  <FaceSmileIcon className="h-5 w-5" />
                </button>
              </div>
              <button 
                type="submit"
                className="p-3.5 bg-brand-600 text-white rounded-2xl shadow-lg shadow-brand-100 hover:bg-brand-700 transition-all group active:scale-95"
              >
                <PaperAirplaneIcon className="h-6 w-6 -rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
