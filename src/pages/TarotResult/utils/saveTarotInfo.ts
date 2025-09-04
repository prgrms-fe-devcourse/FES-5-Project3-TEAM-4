import supabase from '@/common/api/supabase/supabase';
import { showAlert } from '@/common/utils/sweetalert';
import type { Tables, TablesInsert } from '@/common/api/supabase/database.types';
import type { TarotAnalysis } from '@/common/types/TarotAnalysis';

async function getUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data?.session?.user?.id ?? null;
}

function normName(raw: string | null | undefined): string {
  return (raw ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[()[\]]/g, '')
    .replace(/\b(reversed|reverse|upright|rx|rev|역방향|정방향)\b/g, '')
    .trim();
}
const str = (v: unknown) => (typeof v === 'string' ? v : '');
const isRecord = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === 'object';

type SubLike = { name?: string | null; interpretation?: string | null };
function isSubLike(v: unknown): v is SubLike {
  if (!isRecord(v)) return false;
  return (
    (v.name == null || typeof v.name === 'string') &&
    (v.interpretation == null || typeof v.interpretation === 'string')
  );
}

type CardLike = {
  name?: string | null;
  title?: string | null;
  interpretation?: string | null;
  keywordsInterpretation?: string | null;
  subcards?: SubLike | SubLike[] | null;
  subs?: SubLike | SubLike[] | null;
  clarify?: SubLike | SubLike[] | null;
  sub?: SubLike | SubLike[] | null;
};
function isCardLike(v: unknown): v is CardLike {
  if (!isRecord(v)) return false;
  return (
    (v.name == null || typeof v.name === 'string') &&
    (v.title == null || typeof v.title === 'string')
  );
}

function collectSubs(c: CardLike): SubLike[] {
  const buckets = [c.subcards, c.subs, c.clarify, c.sub] as const;
  const out: SubLike[] = [];
  for (const b of buckets) {
    if (Array.isArray(b)) out.push(...b.filter(isSubLike));
    else if (b && isSubLike(b)) out.push(b);
  }
  return out;
}

type TarotInfoMainPick = Pick<Tables<'tarot_info'>, 'id' | 'name' | 'parent_id'>;
async function loadMainIdMapFromDB(
  tarotId: string,
  profileId?: string
): Promise<Record<string, string>> {
  let q = supabase
    .from('tarot_info')
    .select('id,name,parent_id')
    .eq('tarot_id', tarotId)
    .is('parent_id', null);

  if (profileId) q = q.eq('profile_id', profileId);

  const { data, error } = await q;
  if (error) return {};

  const map: Record<string, string> = {};
  const rows = (data ?? []) as TarotInfoMainPick[];
  for (const row of rows) {
    if (!row.id) continue;
    map[normName(row.name ?? '')] = row.id as string;
  }
  return map;
}

export async function saveTarotInfoMain(
  analysis: TarotAnalysis,
  tarotId: string
): Promise<Record<string, string> | null> {
  const userId = await getUserId();
  if (!userId) {
    showAlert('error', '저장 실패', '로그인이 필요합니다.');
    return null;
  }

  const rawCards: unknown[] = Array.isArray((analysis as { cards?: unknown[] }).cards)
    ? ((analysis as { cards?: unknown[] }).cards as unknown[])
    : [];

  const unique = new Map<string, { name: string; result: string | null }>();
  for (const raw of rawCards) {
    if (!isCardLike(raw)) continue;
    const name = (str(raw.name) || str(raw.title)).trim();
    if (!name) continue;

    const interpretation = str(raw.interpretation).trim();
    const keywords = str(
      (raw as { keywordsInterpretation?: string }).keywordsInterpretation
    ).trim();
    const resultJoined = [interpretation, keywords].filter(Boolean).join('\n\n') || null;

    if (!unique.has(name)) unique.set(name, { name, result: resultJoined });
  }

  const inserts: TablesInsert<'tarot_info'>[] = [];
  const nameToId: Record<string, string> = {};

  for (const { name, result } of unique.values()) {
    const id = crypto.randomUUID();
    inserts.push({
      id,
      tarot_id: tarotId,
      profile_id: userId,
      parent_id: null,
      name,
      result,
    });
    nameToId[name] = id;
    nameToId[normName(name)] = id;
  }

  if (!inserts.length) return {};

  const { error } = await supabase.from('tarot_info').insert(inserts);
  if (error) {
    showAlert('error', '상세 저장 실패(메인)', error.message);
    return null;
  }

  return nameToId;
}

export async function saveTarotInfoSubs(
  analysis: TarotAnalysis,
  tarotId: string,
  parentIdByName: Record<string, string> = {}
): Promise<boolean> {
  const userId = await getUserId();
  if (!userId) {
    showAlert('error', '저장 실패', '로그인이 필요합니다.');
    return false;
  }

  const normalizedParentMap: Record<string, string> = {};
  for (const [k, v] of Object.entries(parentIdByName)) {
    if (v) normalizedParentMap[normName(k)] = v;
  }

  let dbMainMap: Record<string, string> | null = null;
  const getParentId = async (mainNameRaw: string): Promise<string | null> => {
    const key = normName(mainNameRaw);
    if (normalizedParentMap[key]) return normalizedParentMap[key];
    if (!dbMainMap) dbMainMap = await loadMainIdMapFromDB(tarotId, userId);
    return dbMainMap[key] ?? null;
  };

  const subRows: TablesInsert<'tarot_info'>[] = [];
  const rawCards: unknown[] = Array.isArray((analysis as { cards?: unknown[] }).cards)
    ? ((analysis as { cards?: unknown[] }).cards as unknown[])
    : [];

  for (const raw of rawCards) {
    if (!isCardLike(raw)) continue;

    const mainName = (str(raw.name) || str(raw.title)).trim();
    if (!mainName) continue;

    const subs = collectSubs(raw);
    if (!subs.length) continue;

    const parentId = await getParentId(mainName);
    if (!parentId) continue;

    for (const s of subs) {
      const subName = str(s.name).trim();
      const subInterp = str(s.interpretation).trim();
      if (!subName || !subInterp) continue;

      subRows.push({
        id: crypto.randomUUID(),
        tarot_id: tarotId,
        profile_id: userId,
        parent_id: parentId,
        name: subName,
        result: subInterp,
      });
    }
  }

  if (!subRows.length) return true;

  const { error } = await supabase.from('tarot_info').insert(subRows);
  if (error) {
    showAlert('error', '상세 저장 실패(서브)', error.message);
    return false;
  }

  return true;
}
