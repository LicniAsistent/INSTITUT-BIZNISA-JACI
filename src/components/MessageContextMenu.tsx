'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { MessageCircle, Star, Lightbulb, Flag, UserPlus } from 'lucide-react';

interface ContextMenuProps {
  children: ReactNode;
  userId: string;
  userNickname: string;
  onSendMessage: (userId: string) => void;
  onPraise: (userId: string) => void;
  onAdvice: (userId: string) => void;
  onReport: (userId: string) => void;
}

export function MessageContextMenu({ 
  children, 
  userId, 
  userNickname,
  onSendMessage, 
  onPraise, 
  onAdvice, 
  onReport 
}: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  };

  const handleClick = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div onContextMenu={handleContextMenu} onClick={handleClick} className="relative">
      {children}
      
      {isOpen && (
        <div
          ref={menuRef}
          className="fixed z-50 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-2 min-w-[200px]"
          style={{ 
            left: position.x, 
            top: position.y,
            transform: position.x > window.innerWidth - 220 ? 'translateX(-220px)' : 'none'
          }}
        >
          {/* Header */}
          <div className="px-4 py-2 border-b border-slate-700 mb-1">
            <p className="text-sm font-semibold text-white">{userNickname || 'Korisnik'}</p>
          </div>

          {/* Pošalji poruku */}
          <button
            onClick={() => {
              onSendMessage(userId);
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center space-x-3"
          >
            <MessageCircle className="w-4 h-4 text-blue-400" />
            <span>Pošalji poruku</span>
          </button>

          {/* Pohvali korisnika */}
          <button
            onClick={() => {
              onPraise(userId);
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center space-x-3"
          >
            <Star className="w-4 h-4 text-yellow-400" />
            <span>Pohvali korisnika</span>
          </button>

          {/* Posavetovao me je */}
          <button
            onClick={() => {
              onAdvice(userId);
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center space-x-3"
          >
            <Lightbulb className="w-4 h-4 text-green-400" />
            <span>Posavetovao me je</span>
          </button>

          {/* Divider */}
          <div className="border-t border-slate-700 my-1"></div>

          {/* Prijavi korisnika */}
          <button
            onClick={() => {
              onReport(userId);
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-700 flex items-center space-x-3"
          >
            <Flag className="w-4 h-4" />
            <span>Prijavi korisnika</span>
          </button>
        </div>
      )}
    </div>
  );
}
