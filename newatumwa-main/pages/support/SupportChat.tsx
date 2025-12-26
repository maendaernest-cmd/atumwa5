import React, { useState } from 'react';
import { 
  PaperAirplaneIcon, 
  FaceSmileIcon, 
  PhotoIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  VideoCameraIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { DashboardShell } from '../../components/dashboard/DashboardShell';

const activeChats = [
  { id: 'C-001', name: 'Farai M.', role: 'User', status: 'Online', lastMsg: 'I have updated the payment details.', time: '2m' },
  { id: 'C-002', name: 'Blessing C.', role: 'Atumwa', status: 'Away', lastMsg: 'The pickup point is closed.', time: '15m' },
  { id: 'C-003', name: 'Sarah K.', role: 'User', status: 'Online', lastMsg: 'Thank you for the help!', time: '1h' },
];

export default function SupportChat() {
  const [selectedChat, setSelectedChat] = useState(activeChats[0]);

  return (
    <DashboardShell role="support" title="Live Support Chat">
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden h-[750px] flex">
        {/* Sidebar */}
        <div className="w-96 border-r border-slate-100 flex flex-col">
          <div className="p-8 border-b border-slate-100">
             <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search chats..." 
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-brand-500 transition-all"
                />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto">
             {activeChats.map(chat => (
               <button
                 key={chat.id}
                 onClick={() => setSelectedChat(chat)}
                 className={`w-full p-8 flex items-start gap-4 transition-all border-b border-slate-50 hover:bg-slate-50 ${
                   selectedChat.id === chat.id ? 'bg-brand-50 border-l-4 border-l-brand-600' : ''
                 }`}
               >
                  <div className="relative">
                     <div className="w-12 h-12 bg-slate-200 rounded-2xl flex items-center justify-center text-slate-500">
                        <UserCircleIcon className="w-8 h-8" />
                     </div>
                     <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-white ${
                       chat.status === 'Online' ? 'bg-green-500' : 'bg-amber-500'
                     }`}></div>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                     <div className="flex justify-between items-center mb-1">
                        <h4 className="font-black text-slate-900 truncate">{chat.name}</h4>
                        <span className="text-[10px] font-black text-slate-400 uppercase">{chat.time}</span>
                     </div>
                     <p className="text-xs font-bold text-slate-500 truncate">{chat.lastMsg}</p>
                     <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest mt-2 block">{chat.role}</span>
                  </div>
               </button>
             ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50/30">
           {/* Header */}
           <div className="bg-white p-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500">
                    <UserCircleIcon className="w-8 h-8" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight">{selectedChat.name}</h3>
                    <p className="text-xs font-bold text-green-500 uppercase tracking-widest">{selectedChat.status}</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <button className="p-3 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
                    <PhoneIcon className="w-6 h-6" />
                 </button>
                 <button className="p-3 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
                    <VideoCameraIcon className="w-6 h-6" />
                 </button>
                 <button className="p-3 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
                    <InformationCircleIcon className="w-6 h-6" />
                 </button>
              </div>
           </div>

           {/* Messages */}
           <div className="flex-1 p-8 overflow-y-auto space-y-6">
              <div className="flex justify-center">
                 <span className="bg-white px-4 py-2 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 shadow-sm">Today</span>
              </div>
              <div className="flex items-start gap-4">
                 <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                    <UserCircleIcon className="w-6 h-6" />
                 </div>
                 <div className="bg-white p-6 rounded-3xl rounded-tl-none border border-slate-100 shadow-sm max-w-md">
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                       Hello, I'm having trouble with my recent transaction. It says completed but the funds aren't in my wallet.
                    </p>
                 </div>
              </div>
              <div className="flex items-start gap-4 flex-row-reverse">
                 <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white">
                    <FaceSmileIcon className="w-6 h-6" />
                 </div>
                 <div className="bg-brand-600 p-6 rounded-3xl rounded-tr-none shadow-lg shadow-brand-100 max-w-md text-white">
                    <p className="text-sm font-medium leading-relaxed">
                       Hello Farai! I'll be happy to help you with that. Let me check the system logs for transaction ID TX-901.
                    </p>
                 </div>
              </div>
           </div>

           {/* Input */}
           <div className="p-8 bg-white border-t border-slate-100">
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                 <button className="p-2 text-slate-400 hover:text-brand-600 transition-colors">
                    <PhotoIcon className="w-6 h-6" />
                 </button>
                 <input 
                   type="text" 
                   placeholder="Type your message..." 
                   className="flex-1 bg-transparent border-none text-sm font-medium focus:ring-0"
                 />
                 <button className="bg-brand-600 text-white p-4 rounded-2xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-100 active:scale-95">
                    <PaperAirplaneIcon className="w-5 h-5" />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </DashboardShell>
  );
}
