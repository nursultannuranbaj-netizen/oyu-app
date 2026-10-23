import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Button, Icon, Ornament, Stat } from '../components/ui';
import { COURSE } from '../content';
import { makeT, tri, type Lang } from '../i18n';
import { correctIndex, progressPct, type LessonState } from '../lesson';
import { F, type Colors } from '../theme';

export function LessonScreen({ c, lang, lesson, hearts, onSelect, onCheck, onNext, onQuit }: {
  c: Colors; lang: Lang; lesson: LessonState; hearts: number;
  onSelect: (i: number) => void; onCheck: () => void; onNext: () => void; onQuit: () => void;
}) {
  const t = makeT(lang);
  const { width } = useWindowDimensions();
  const s = lesson.steps[lesson.pos];
  const pct = progressPct(lesson);

  const top = (
    <View style={styles.bar}>
      <Pressable accessibilityRole="button" accessibilityLabel={t('quit')} onPress={onQuit} hitSlop={10}>
        <Icon name="close" color={c.muted} size={26} />
      </Pressable>
      <View style={[styles.track, { backgroundColor: c.locked }]} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: pct }}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: c.ok }]} />
      </View>
      <Stat icon="heart" color={c.heart} value={hearts} />
    </View>
  );

  if (s.k === 'intro') {
    const o = COURSE.orn[lesson.id];
    return (
      <View style={styles.flex}>
        {top}
        <ScrollView contentContainerStyle={[styles.body, { alignItems: 'center' }]}>
          <Text style={[styles.kind, { color: c.primary }]}>{t('newOrn').toUpperCase()}</Text>
          <Ornament id={lesson.id} size={Math.min(190, width * 0.5)} />
          <Text style={[styles.h1, { color: c.ink }]}>{o.kz}</Text>
          <Text style={[styles.tr, { color: c.muted }]}>{o.tr}{lang === 0 ? '' : ' · ' + tri(o.gl, lang)}</Text>
          <Text style={[styles.desc, { color: c.ink }]}>{tri(o.d, lang)}</Text>
          <View style={[styles.symbol, { backgroundColor: c.surface, borderColor: c.line }]}>
            <Text style={[styles.symLabel, { color: c.gold }]}>{t('symbol').toUpperCase()}</Text>
            <Text style={[styles.symText, { color: c.ink }]}>{tri(o.s, lang)}</Text>
          </View>
        </ScrollView>
        <View style={[styles.foot, { borderTopColor: c.line, backgroundColor: c.bg }]}>
          <Button c={c} title={t('next')} onPress={onNext} />
        </View>
      </View>
    );
  }

  const correct = correctIndex(lesson, s);
  const mark = (idx: number) => (!lesson.checked ? (lesson.sel === idx ? 'sel' : '') : idx === correct ? 'right' : idx === lesson.sel ? 'wrong' : '');
  const look = (m: string) =>
    m === 'sel' ? { borderColor: c.primary, backgroundColor: c.surface2, borderBottomColor: c.primary, txt: c.primary }
    : m === 'right' ? { borderColor: c.ok, backgroundColor: c.okBg, borderBottomColor: c.ok, txt: c.ok }
    : m === 'wrong' ? { borderColor: c.bad, backgroundColor: c.badBg, borderBottomColor: c.bad, txt: c.bad }
    : { borderColor: c.line, backgroundColor: c.surface, borderBottomColor: c.line, txt: c.ink };

  let content: React.ReactNode;
  let answerText = '';
  if (s.k === 'task') {
    const tk = COURSE.orn[lesson.id].tasks[s.i];
    answerText = tri(tk.o[correct], lang);
    content = (
      <>
        <Text style={[styles.kind, { color: c.primary }]}>{t(tk.t).toUpperCase()}</Text>
        <View style={styles.qrow}>
          <Ornament id={lesson.id} size={84} />
          <Text style={[styles.q, { color: c.ink }]}>{tri(tk.q, lang)}</Text>
        </View>
        <View style={styles.opts}>
          {s.order.map((idx, n) => {
            const L = look(mark(idx));
            return (
              <Pressable key={idx} disabled={lesson.checked} onPress={() => onSelect(idx)} accessibilityRole="button"
                accessibilityState={{ selected: lesson.sel === idx }}
                style={[styles.opt, { borderColor: L.borderColor, backgroundColor: L.backgroundColor, borderBottomColor: L.borderBottomColor }]}>
                <View style={[styles.key, { borderColor: L.borderColor === c.line ? c.line : L.borderColor }]}>
                  <Text style={[styles.keyText, { color: L.txt === c.ink ? c.muted : L.txt }]}>{n + 1}</Text>
                </View>
                <Text style={[styles.optText, { color: L.txt }]}>{tri(tk.o[idx], lang)}</Text>
              </Pressable>
            );
          })}
        </View>
      </>
    );
  } else {
    const q = s.k === 'visual' ? t('whichOne', { n: COURSE.orn[lesson.id].kz }) : tri(s.q, lang);
    answerText = COURSE.orn[s.ids[0]].kz;
    const tile = (width - 32 - 20) / 3;
    content = (
      <>
        <Text style={[styles.kind, { color: c.primary }]}>{t('visual').toUpperCase()}</Text>
        <Text style={[styles.q, { color: c.ink }]}>{q}</Text>
        <View style={styles.pics}>
          {s.order.map((idx, n) => {
            const L = look(mark(idx));
            return (
              <Pressable key={idx} disabled={lesson.checked} onPress={() => onSelect(idx)} accessibilityRole="button"
                accessibilityLabel={String(n + 1)}
                style={[styles.pic, { width: tile, borderColor: L.borderColor, backgroundColor: L.backgroundColor, borderBottomColor: L.borderBottomColor }]}>
                <Ornament id={s.ids[idx]} size={tile - 20} />
                <Text style={[styles.picKey, { color: c.muted }]} numberOfLines={1}>{lesson.checked ? COURSE.orn[s.ids[idx]].kz : String(n + 1)}</Text>
              </Pressable>
            );
          })}
        </View>
      </>
    );
  }

  let foot: React.ReactNode;
  if (!lesson.checked) {
    foot = (
      <View style={[styles.foot, { borderTopColor: c.line, backgroundColor: c.bg }]}>
        <Button c={c} title={t('check')} onPress={onCheck} disabled={lesson.sel === null} />
      </View>
    );
  } else {
    const ok = !!lesson.ok;
    const extra = ok
      ? s.k === 'cp' ? tri(COURSE.orn[s.ids[0]].s, lang) : s.k === 'visual' ? `${COURSE.orn[lesson.id].kz} — ${tri(COURSE.orn[lesson.id].gl, lang)}` : ''
      : `${t('rightAnswer')} ${answerText}`;
    foot = (
      <View style={[styles.foot, { backgroundColor: ok ? c.okBg : c.badBg, borderTopColor: 'transparent' }]} accessibilityLiveRegion="polite">
        <View style={styles.fb}>
          <View style={[styles.mark, { backgroundColor: c.surface }]}>
            <Icon name={ok ? 'check' : 'close'} color={ok ? c.ok : c.bad} size={24} />
          </View>
          <View style={styles.flex}>
            <Text style={[styles.fbTitle, { color: ok ? c.ok : c.bad }]}>{t(ok ? 'correct' : 'wrong')}</Text>
            {!!extra && <Text style={[styles.fbText, { color: ok ? c.ok : c.bad }]}>{extra}</Text>}
          </View>
        </View>
        <Button c={c} kind={ok ? 'ok' : 'bad'} title={t('next')} onPress={onNext} />
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      {top}
      <ScrollView contentContainerStyle={styles.body}>{content}</ScrollView>
      {foot}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  track: { flex: 1, height: 16, borderRadius: 99, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 99 },
  body: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24, gap: 16 },
  kind: { fontFamily: F.black, fontSize: 13, letterSpacing: 1 },
  h1: { fontFamily: F.display, fontSize: 30, lineHeight: 38, textAlign: 'center' },
  tr: { fontFamily: F.bold, fontSize: 16 },
  desc: { fontFamily: F.body, fontSize: 16, lineHeight: 23, alignSelf: 'stretch' },
  symbol: { alignSelf: 'stretch', borderWidth: 2, borderRadius: 16, padding: 14, gap: 4 },
  symLabel: { fontFamily: F.black, fontSize: 12, letterSpacing: 1 },
  symText: { fontFamily: F.bold, fontSize: 16, lineHeight: 22 },
  qrow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  q: { flex: 1, fontFamily: F.black, fontSize: 21, lineHeight: 27 },
  opts: { gap: 10 },
  opt: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 2, borderBottomWidth: 5, borderRadius: 16, paddingVertical: 13, paddingHorizontal: 14 },
  key: { width: 28, height: 28, borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  keyText: { fontFamily: F.black, fontSize: 13 },
  optText: { flex: 1, fontFamily: F.bold, fontSize: 16, lineHeight: 21 },
  pics: { flexDirection: 'row', gap: 10 },
  pic: { borderWidth: 2, borderBottomWidth: 5, borderRadius: 18, padding: 8, alignItems: 'center', gap: 6 },
  picKey: { fontFamily: F.black, fontSize: 12 },
  foot: { borderTopWidth: 2, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16, gap: 12 },
  fb: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  mark: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  fbTitle: { fontFamily: F.black, fontSize: 19 },
  fbText: { fontFamily: F.bold, fontSize: 15, lineHeight: 21 },
});
