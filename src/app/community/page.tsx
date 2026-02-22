'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MessageContextMenu } from '@/components/MessageContextMenu';
import {
  Send,
  Hash,
  Pin,
  MoreVertical,
  Image as ImageIcon,
  Smile,
  Crown,
  CheckCircle,
  BookOpen,
  Lightbulb,
  FileText,
  Video,
  Award,
  GraduationCap,
  MessageSquare,
} from 'lucide-react';

interface Channel {
  id: string;
  name: string;
  description: string | null;
  category: string;
  type: string;
  _count: { messages: number };
}

interface Message {
  id: string;
  content: string;
  imageUrl: string | null;
  pinned: boolean;
  createdAt: string;
  user: {
    id: string;
    nickname: string | null;
    avatar: string | null;
    rank: number;
    verified: boolean;
  };
}

const rankNames: Record<number, string> = {
  1: 'Polaznik',
  2: 'Aktivni učenik',
  3: 'Pripravnik',
  4: 'Kandidat za biznis',
  5: 'Preduzetnik',
  6: 'Izvršni direktor',
  7: 'Vizionar',
};

const rankColors: Record<number, string> = {
  1: 'text-gray-400',
  2: 'text-gray-300',
  3: 'text-blue-400',
  4: 'text-green-400',
  5: 'text-yellow-400',
  6: 'text-orange-400',
  7: 'text-yellow-300',
};

export default function CommunityPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }
    fetchChannels();
  }, [status]);

  useEffect(() => {
    if (selectedChannel) {
      fetchMessages();
      // Start polling for new messages
      pollingRef.current = setInterval(fetchMessages, 3000);
    }
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [selectedChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChannels = async () => {
    try {
      const response = await fetch('/api/channels');
      const data = await response.json();
      setChannels(data);
      if (data.length > 0 && !selectedChannel) {
        setSelectedChannel(data[0]);
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedChannel) return;
    try {
      const response = await fetch(`/api/messages?channelId=${selectedChannel.id}&limit=100`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChannel) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId: selectedChannel.id,
          content: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Context menu handlers
  const handleSendMessage = async (userId: string) => {
    // For now, navigate to community to start a conversation
    // In future, this could open a direct message
    router.push('/community');
  };

  const handlePraise = async (userId: string) => {
    try {
      const response = await fetch('/api/users/praise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, type: 'praise' }),
      });
      const data = await response.json();
      alert(data.message || 'Korisnik je pohvaljen!');
    } catch (error) {
      console.error('Error praising user:', error);
      alert('Greška pri pohvali');
    }
  };

  const handleAdvice = async (userId: string) => {
    try {
      const response = await fetch('/api/users/praise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, type: 'advice' }),
      });
      const data = await response.json();
      alert(data.message || 'Hvala na savetu!');
    } catch (error) {
      console.error('Error giving advice:', error);
      alert('Greška pri davanju saveta');
    }
  };

  const handleReport = async (userId: string) => {
    const reason = prompt('Unesite razlog prijave:');
    if (!reason) return;
    
    try {
      const response = await fetch('/api/users/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, reason }),
      });
      const data = await response.json();
      alert(data.message || 'Prijave prosleđene administratorima');
    } catch (error) {
      console.error('Error reporting user:', error);
      alert('Greška pri prijavi');
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Danas';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Juče';
    } else {
      return date.toLocaleDateString('sr-RS', { day: 'numeric', month: 'long' });
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Group channels by category
  const channelsByCategory = channels.reduce((groups, channel) => {
    if (!groups[channel.category]) {
      groups[channel.category] = [];
    }
    groups[channel.category].push(channel);
    return groups;
  }, {} as Record<string, Channel[]>);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Floating Header */}
      <div className="h-14 bg-kimi/80 backdrop-blur-md border-b border-slate-700 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <Hash className="w-5 h-5 text-gold" />
          <span className="font-semibold text-white">Zajednica</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
      {/* Channels Sidebar */}
      <div className="w-64 bg-slate-800/50 border-r border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-700 flex-shrink-0">
          <h2 className="text-lg font-semibold text-white">Zajednica</h2>
          <p className="text-slate-400 text-sm">Povežite se sa drugima</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2 min-h-0">
          {Object.entries(channelsByCategory).map(([category, categoryChannels]) => (
            <div key={category} className="mb-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase px-2 mb-2">
                {category}
              </h3>
              {categoryChannels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={`w-full flex items-center space-x-2 px-2 py-2 rounded-lg text-left transition-all ${
                    selectedChannel?.id === channel.id
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  <Hash className="w-4 h-4" />
                  <span className="flex-1 truncate">{channel.name}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area + Right Sidebar */}
      <div className="flex-1 flex min-h-0">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-900 min-h-0">
          {selectedChannel ? (
          <>
            {/* Channel Header */}
            <div className="h-16 border-b border-slate-700 flex items-center justify-between px-6 flex-shrink-0">
              <div>
                <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <Hash className="w-5 h-5 text-slate-400" />
                  <span>{selectedChannel.name}</span>
                </h2>
                {selectedChannel.description && (
                  <p className="text-slate-400 text-sm">{selectedChannel.description}</p>
                )}
              </div>
              <div className="flex items-center space-x-2 text-slate-400">
                <span className="text-sm">{messages.length} poruka</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date}>
                  <div className="flex items-center justify-center mb-4">
                    <div className="px-4 py-1 rounded-full bg-slate-800 text-slate-400 text-xs">
                      {formatDate(dateMessages[0].createdAt)}
                    </div>
                  </div>
                  <div className="space-y-4">
                    {dateMessages.map((message) => (
                      <MessageContextMenu
                        key={message.id}
                        userId={message.user.id}
                        userNickname={message.user.nickname || 'Korisnik'}
                        onSendMessage={handleSendMessage}
                        onPraise={handlePraise}
                        onAdvice={handleAdvice}
                        onReport={handleReport}
                      >
                      <div
                        className={`flex space-x-4 ${
                          message.user.id === session?.user?.id ? 'flex-row-reverse space-x-reverse' : ''
                        }`}
                      >
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {message.user.avatar ? (
                            <img
                              src={message.user.avatar}
                              alt={message.user.nickname || ''}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-slate-900 font-bold">
                              {(message.user.nickname?.[0] || 'U').toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* Message Content */}
                        <div className={`flex-1 max-w-2xl ${
                          message.user.id === session?.user?.id ? 'text-right' : ''
                        }`}>
                          <div className={`inline-block text-left ${
                            message.user.id === session?.user?.id
                              ? 'bg-yellow-500/20 border-yellow-500/30'
                              : 'bg-slate-800 border-slate-700'
                          } border rounded-lg p-4`}>
                            {/* User Info */}
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`font-semibold text-sm ${rankColors[message.user.rank]}`}>
                                {message.user.nickname || 'Korisnik'}
                              </span>
                              {message.user.verified && (
                                <CheckCircle className="w-4 h-4 text-blue-500" />
                              )}
                              <span className="text-xs text-slate-500">
                                {rankNames[message.user.rank]}
                              </span>
                              <span className="text-xs text-slate-500">
                                {formatTime(message.createdAt)}
                              </span>
                              {message.pinned && (
                                <Pin className="w-3 h-3 text-yellow-500" />
                              )}
                            </div>

                            {/* Message Text */}
                            <p className="text-slate-200 whitespace-pre-wrap">{message.content}</p>

                            {/* Image */}
                            {message.imageUrl && (
                              <img
                                src={message.imageUrl}
                                alt="Attachment"
                                className="mt-2 rounded-lg max-w-full"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      </MessageContextMenu>
                    ))}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-slate-700">
              <form onSubmit={sendMessage} className="flex items-center space-x-4">
                <button
                  type="button"
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Napišite poruku..."
                  className="flex-1 input-field"
                />
                <button
                  type="button"
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <Smile className="w-5 h-5" />
                </button>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-3 bg-yellow-500 text-slate-900 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Hash className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Izaberite kanal da biste započeli razgovor</p>
            </div>
          </div>
        )}

        </div>

        {/* Right Sidebar - Learning Panel */}
        <div className="w-72 bg-slate-800/30 border-l border-slate-700 flex flex-col">
          <div className="p-4 border-b border-slate-700 flex-shrink-0">
            <h3 className="font-semibold text-white flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-gold" />
              <span>Učenje</span>
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {/* Daily Tip */}
            <div className="bg-kimi-light/20 rounded-lg p-4 border border-kimi/30">
              <div className="flex items-center space-x-2 mb-2">
                <Lightbulb className="w-4 h-4 text-gold" />
                <span className="text-sm font-semibold text-gold">Dnevni savet</span>
              </div>
              <p className="text-sm text-slate-300">
                "Najbolji način da predvidite budućnost je da je kreirate. - Peter Drucker"
              </p>
            </div>

            {/* Quick Stats */}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-white mb-3">Tvoja statistika</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">XP danas:</span>
                  <span className="text-gold font-semibold">+50</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Poruke:</span>
                  <span className="text-white">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Ranking:</span>
                  <span className="text-blue-400">#45</span>
                </div>
              </div>
            </div>

            {/* Learning Resources */}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-white mb-3">Korisni resursi</h4>
              <div className="space-y-2">
                <a href="/courses" className="flex items-center space-x-2 text-sm text-slate-300 hover:text-gold transition-colors">
                  <GraduationCap className="w-4 h-4" />
                  <span>Browse kursevi</span>
                </a>
                <a href="/courses" className="flex items-center space-x-2 text-sm text-slate-300 hover:text-gold transition-colors">
                  <FileText className="w-4 h-4" />
                  <span>Vodiči za biznis</span>
                </a>
                <a href="/courses" className="flex items-center space-x-2 text-sm text-slate-300 hover:text-gold transition-colors">
                  <Video className="w-4 h-4" />
                  <span>Video tutorijali</span>
                </a>
              </div>
            </div>

            {/* Achievements Preview */}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-white mb-3">Nedavna dostignuća</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-gold" />
                  <span className="text-sm text-slate-300">Dobrodošao</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
