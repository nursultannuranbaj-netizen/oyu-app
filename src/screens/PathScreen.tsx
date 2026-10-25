import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { hornStripXml, SHANYRAK_XML } from '../art';
import { Ornament } from '../components/ui';
import { COURSE } from '../content';
import { tri, type Lang, makeT } from '../i18n';
import { currentNode, isUnlocked } from '../lesson';
import { F, type Colors } from '../theme';

const OFFS = [0, 46, 70, 46, 0, -46, -70, -46];
type NodeState = 'done' | 'current' | 'open' | 'locked';

export function PathScreen({ c, lang, done, onOpen }: {
  c: Colors; lang: Lang; done: Record<string, boolean>; onOpen: (id: string) => void;
}) {
  const t = makeT(lang);
  const cur = currentNode(done);
  const stateOf = (id: string): NodeState => (done[id] ? 'done' : id === cur ? 'current' : isUnlocked(id, done) ? 'open' : 'locked');
  let k = 0;

  const node = (id: string, label: string, isCp: boolean) => {
    const s = stateOf(id);
    const off = isCp ? 0 : OFFS[k++ % OFFS.length];
    const bg = s === 'done' ? c.gold : s === 'current' || (isCp && s === 'open') ? c.primary : s === 'locked' ? c.locked : c.surface;
    const edge = s === 'done' ? c.goldEdge : s === 'current' || (isCp && s === 'open') ? c.primaryEdge : c.lockedEdge;
    const size = isCp ? 92 : 76;
    return (
      <View key={id} style={[styles.nodeWrap, { transform: [{ translateX: off }] }]}>
        {s === 'current' && (
          <View style={[styles.bubble, { backgroundColor: c.surface, borderColor: c.line }]}>
            <Text style={[styles.bubbleText, { color: c.primary }]}>{t('start').toUpperCase()}</Text>
          </View>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
          onPress={() => onOpen(id)}
          style={({ pressed }) => [
            styles.node,
            { width: size, height: size - 4, borderRadius: size / 2, backgroundColor: bg, borderBottomColor: edge, borderBottomWidth: pressed ? 2 : 6, marginTop: pressed ? 4 : 0 },
            s === 'current' && { borderWidth: 3, borderColor: c.primaryEdge, borderBottomWidth: pressed ? 2 : 6 },
          ]}
        >
          {isCp ? <SvgXml xml={SHANYRAK_XML} width={60} height={60} /> : <Ornament id={id} size={56} dim={s === 'locked'} />}
        </Pressable>
        <Text style={[styles.nlabel, { color: c.muted }]} numberOfLines={2}>{label}</Text>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      {COURSE.modules.map(m => {
        const ids = m.units.flatMap(u => u.lessons);
        const doneN = ids.filter(id => done[id]).length;
        return (
          <View key={m.id} style={styles.module}>
            <View style={[styles.banner, { backgroundColor: [c.m1, c.m2, c.m3, c.m4, c.m5][(m.id - 1) % 5] }]}>
              <View style={styles.strip} pointerEvents="none">
                <SvgXml xml={hornStripXml('#FFFFFF')} width={110} height={176} />
              </View>
              <Text style={styles.eyebrow}>{t('module').toUpperCase()} {m.id}</Text>
              <Text style={styles.btitle}>{tri(m.title, lang)}</Text>
              <Text style={styles.bprog}>{doneN} / {ids.length}</Text>
            </View>
            {m.units.map((u, ui) => (
              <View key={ui} style={styles.unit}>
                <View style={styles.unitH}>
                  <View style={[styles.rule, { backgroundColor: c.line }]} />
                  <Text style={[styles.unitText, { color: c.muted }]}>{tri(u.title, lang).toUpperCase()}</Text>
                  <View style={[styles.rule, { backgroundColor: c.line }]} />
                </View>
                {u.lessons.map(id => node(id, COURSE.orn[id].kz, false))}
              </View>
            ))}
            {node('CP' + m.id, t('checkpoint'), true)}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 40, gap: 26 },
  module: { gap: 20 },
  banner: { borderRadius: 20, padding: 18, overflow: 'hidden', gap: 2 },
  strip: { position: 'absolute', right: -8, top: -8, opacity: 0.22 },
  eyebrow: { color: '#FFFFFF', opacity: 0.85, fontFamily: 'Nunito_900Black', fontSize: 12, letterSpacing: 1.2 },
  btitle: { color: '#FFFFFF', fontFamily: F.display, fontSize: 20, lineHeight: 26 },
  bprog: { color: '#FFFFFF', opacity: 0.9, fontFamily: F.bold, fontSize: 14 },
  unit: { gap: 18, alignItems: 'center' },
  unitH: { flexDirection: 'row', alignItems: 'center', gap: 10, alignSelf: 'stretch', marginBottom: 16 },
  rule: { flex: 1, height: 2 },
  unitText: { fontFamily: F.black, fontSize: 13, letterSpacing: 1 },
  nodeWrap: { alignItems: 'center', gap: 4, alignSelf: 'center' },
  node: { alignItems: 'center', justifyContent: 'center' },
  nlabel: { fontFamily: F.bold, fontSize: 13, textAlign: 'center', maxWidth: 120 },
  bubble: { position: 'absolute', top: -40, borderWidth: 2, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 5, zIndex: 2 },
  bubbleText: { fontFamily: F.black, fontSize: 13, letterSpacing: 0.8 },
});
