type Props = { children?: React.ReactNode; className?: string };

export default function Bg({ children, className }: Props) {
  return (
    <div
      className={[
        'relative w-full min-h-screen overflow-hidden',
        'bg-[#0E0724]',
        'bg-[radial-gradient(30.39%_56.9%_at_34.56%_-24.21%,rgba(255,174,23,0.35)_4.04%,rgba(255,174,23,0.12)_44.71%,rgba(255,174,23,0)_96.63%),radial-gradient(20.83%_37.04%_at_56.8%_107.13%,rgba(222,51,113,0.35)_0%,rgba(222,51,113,0.12)_53.37%,rgba(222,51,113,0)_100%),radial-gradient(44.58%_79.26%_at_26.33%_-9.17%,rgba(63,18,108,0.55)_0%,rgba(63,18,108,0.18)_55%,rgba(63,18,108,0)_100%),radial-gradient(33.93%_60.32%_at_78.49%_110.32%,rgba(222,51,113,0.9)_0%,rgba(222,51,113,0.22)_55%,rgba(222,51,113,0)_100%),linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.3)_100%)]',
        'bg-no-repeat',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </div>
  );
}
