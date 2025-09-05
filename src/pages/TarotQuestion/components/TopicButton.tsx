import type { TopicLabel } from '../types/TarotTopics';

type TopicButtonProps = {
  topic: TopicLabel;
  selected?: boolean;
  onSelect?: (topic: TopicLabel) => void;
  className?: string;
};

export default function TopicButton(props: TopicButtonProps) {
  const { topic, selected = false, onSelect, className = '' } = props;

  const handleClick = () => {
    if (onSelect) onSelect(topic);
  };

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={handleClick}
      className={[
        'inline-flex items-center justify-center px-2.5 py-1.5 select-none',
        'rounded-full border transition-all duration-200 cursor-pointer',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0724]',
        'hover:shadow-[0_0_12px_#ffffff] hover:-translate-y-0.5 hover:bg-white/5',
        selected
          ? [
              'text-main-white border-main-white',
              'bg-[linear-gradient(90deg,#0E0724_6.73%,rgba(96,24,67,0.81)_55.29%,rgba(159,38,91,0.67)_77.4%,rgba(235,54,120,0.50)_100%)]',
            ].join(' ')
          : ['text-main-white/90 border-main-white/40 bg-transparent'].join(' '),
        className,
      ].join(' ')}
    >
      {topic}
    </button>
  );
}
