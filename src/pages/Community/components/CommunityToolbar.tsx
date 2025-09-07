import { SearchInput } from '@/common/components/SearchInput';
import { SortBar, type SortKey } from './SortBar';

type CommunityToolbarProps = {
  inputValue: string;
  onInputChange: (value: string) => void;
  sort: SortKey;
  onSortChange: (s: SortKey) => void;
};

export function CommunityToolbar({
  inputValue,
  onInputChange,
  sort,
  onSortChange,
}: CommunityToolbarProps) {
  return (
    <>
      <SearchInput
        placeholder="검색어를 입력해주세요"
        value={inputValue}
        onChange={(e) => onInputChange(e.currentTarget.value)}
      />
      <SortBar value={sort} onChange={onSortChange} />
    </>
  );
}
