'use client';

import React, { useState } from 'react';
import { Room } from '@/types';
import { DEFAULT_AVATARS } from '@/lib/defaultAvatars';
import { updateRoomDetails } from '@/lib/appService';
import { X, Calendar, Heart, MessageSquare, Sparkles } from 'lucide-react';

interface EditRoomModalProps {
  room: Room;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (updatedRoom: Room) => void;
}

export default function EditRoomModal({ room, isOpen, onClose, onUpdated }: EditRoomModalProps) {
  const [startDate, setStartDate] = useState(room.start_date);
  const [loveQuote, setLoveQuote] = useState(room.love_quote || '');
  const [creatorNickname, setCreatorNickname] = useState(room.creator_nickname || 'Anh');
  const [partnerNickname, setPartnerNickname] = useState(room.partner_nickname || 'Em');
  const [creatorAvatar, setCreatorAvatar] = useState(room.creator_avatar || 'boy-1');
  const [partnerAvatar, setPartnerAvatar] = useState(room.partner_avatar || 'girl-1');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate) {
      setErrorMsg('Vui lòng chọn ngày bắt đầu yêu nhau');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');

    const { room: updated, error } = await updateRoomDetails(room.id, {
      start_date: startDate,
      love_quote: loveQuote,
      creator_nickname: creatorNickname,
      partner_nickname: partnerNickname,
      creator_avatar: creatorAvatar,
      partner_avatar: partnerAvatar,
    });

    setIsSaving(false);

    if (error) {
      setErrorMsg(error);
      return;
    }

    if (updated) {
      onUpdated(updated);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="glass-card rounded-3xl w-full max-w-lg p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto shadow-2xl border border-white/90">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-pink-100/50 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-md shadow-pink-200">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Chỉnh Sửa Không Gian Yêu</h2>
            <p className="text-xs text-gray-500">Cập nhật ngày kỷ niệm & thông tin cặp đôi</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Ngày bắt đầu yêu */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              <Calendar className="w-3.5 h-3.5 inline mr-1 text-pink-500" />
              Ngày Bắt Đầu Yêu
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-2xl glass-input text-gray-800 text-sm font-medium focus:ring-2 focus:ring-pink-300"
            />
          </div>

          {/* Biệt danh 2 người */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Biệt danh của Bạn</label>
              <input
                type="text"
                value={creatorNickname}
                onChange={(e) => setCreatorNickname(e.target.value)}
                placeholder="VD: Anh iu, Hoàng tử"
                className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-gray-800 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Biệt danh Người ấy</label>
              <input
                type="text"
                value={partnerNickname}
                onChange={(e) => setPartnerNickname(e.target.value)}
                placeholder="VD: Em iu, Công chúa"
                className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-gray-800 text-sm"
              />
            </div>
          </div>

          {/* Chọn Avatar bạn */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Avatar của Bạn</label>
            <div className="grid grid-cols-4 gap-2">
              {DEFAULT_AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setCreatorAvatar(av.id)}
                  className={`p-2 rounded-2xl flex flex-col items-center justify-center border transition-all cursor-pointer ${
                    creatorAvatar === av.id
                      ? 'border-pink-500 bg-pink-100/80 shadow-xs scale-105'
                      : 'border-transparent bg-white/60 hover:bg-pink-50'
                  }`}
                >
                  <span className="text-2xl">{av.emoji}</span>
                  <span className="text-[10px] text-gray-600 truncate w-full text-center mt-1">{av.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chọn Avatar người ấy */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Avatar Người ấy</label>
            <div className="grid grid-cols-4 gap-2">
              {DEFAULT_AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setPartnerAvatar(av.id)}
                  className={`p-2 rounded-2xl flex flex-col items-center justify-center border transition-all cursor-pointer ${
                    partnerAvatar === av.id
                      ? 'border-purple-500 bg-purple-100/80 shadow-xs scale-105'
                      : 'border-transparent bg-white/60 hover:bg-purple-50'
                  }`}
                >
                  <span className="text-2xl">{av.emoji}</span>
                  <span className="text-[10px] text-gray-600 truncate w-full text-center mt-1">{av.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Lời nhắn yêu thương */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              <MessageSquare className="w-3.5 h-3.5 inline mr-1 text-pink-500" />
              Lời Nhắn Yêu Thương (Quote)
            </label>
            <textarea
              rows={2}
              value={loveQuote}
              onChange={(e) => setLoveQuote(e.target.value)}
              placeholder="VD: Cùng nhau già đi em nhé! 💕"
              className="w-full px-4 py-2.5 rounded-2xl glass-input text-gray-800 text-sm focus:ring-2 focus:ring-pink-300"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold shadow-md shadow-pink-200 hover:from-pink-600 hover:to-rose-600 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isSaving ? (
                'Đang lưu...'
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Lưu Thay Đổi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
