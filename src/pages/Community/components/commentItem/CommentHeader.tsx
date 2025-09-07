type CommentHeaderProps = { avatarSrc: string; displayName: string; createdAt: string };

export default function CommentHeader({ avatarSrc, displayName, createdAt }: CommentHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="inline-flex h-7 w-7 items-center justify-center overflow-hidden">
        <img src={avatarSrc} alt="프로필 이미지" className="h-full w-full object-cover" />
      </div>
      <span>{displayName}</span>
      <span className="text-white/40">·</span>
      <span>{createdAt}</span>
    </div>
  );
}
