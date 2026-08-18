export interface AvatarOption {
  id: string;
  name: string;
  emoji: string;
  gradient: string;
}

export const DEFAULT_AVATARS: AvatarOption[] = [
  { id: 'boy-1', name: 'Chàng trai ấm áp', emoji: '👦🏻', gradient: 'from-blue-400 to-indigo-500' },
  { id: 'girl-1', name: 'Cô gái dịu dàng', emoji: '👧🏻', gradient: 'from-pink-400 to-rose-500' },
  { id: 'cat-1', name: 'Mèo con cute', emoji: '🐱', gradient: 'from-amber-400 to-orange-500' },
  { id: 'bunny-1', name: 'Thỏ ngọc đáng yêu', emoji: '🐰', gradient: 'from-fuchsia-400 to-pink-500' },
  { id: 'bear-1', name: 'Gấu múp míp', emoji: '🐻', gradient: 'from-amber-500 to-yellow-600' },
  { id: 'puppy-1', name: 'Cún cưng trung thành', emoji: '🐶', gradient: 'from-emerald-400 to-teal-500' },
  { id: 'prince-1', name: 'Hoàng tử', emoji: '🤴🏻', gradient: 'from-violet-400 to-purple-600' },
  { id: 'princess-1', name: 'Công chúa', emoji: '👸🏻', gradient: 'from-rose-400 to-pink-600' },
];

export function getAvatarById(id: string | null | undefined): AvatarOption {
  if (!id) return DEFAULT_AVATARS[0];
  const found = DEFAULT_AVATARS.find((a) => a.id === id);
  return found || DEFAULT_AVATARS[0];
}
