import React, { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { SHANYRAK_XML } from '../art';
import { Button, Icon, Ornament } from '../components/ui';
import { COURSE } from '../content';
import { LANG_LABELS, makeT, tri, type Lang } from '../i18n';
import { ALL_ORNAMENTS, type LessonResult } from '../lesson';
import { F, type Colors } from '../theme';

/* ---------- Lesson finished ---------- */
export function DoneScreen({ c, lang, r, onNext }: { c: Colors; lang: Lang; r: LessonResult; onNext: () => void }) {
  const t = makeT(lang);
  return (
    <ScrollView contentContainerStyle={styles.center}>
      {r.isCp ? (
        <View style={[styles.cpArt, { backgroundColor: c.gold }]}><SvgXml xml={SHANYRAK_XML} width={110} height={110} /></View>
      ) : (
        <Ornament id={r.id} size={160} />
      )}
      <Text style={[styles.doneTitle, { color: c.gold }]}>{t(r.isCp ? 'cpDone' : 'lessonDone')}</Text>
      <View style={styles.stats}>
        <View style={[styles.st, { borderColor: c.gold }]}>
          <Text style={[styles.stLabel, { backgroundColor: c.gold }]}>{t('xpEarned').toUpperCase()}</Text>
          <Text style={[styles.stVal, { color: c.ink, backgroundColor: c.surface }]}>+{r.gain}</Text>
        </View>
        <View style={[styles.st, { borderColor: c.ok }]}>
          <Text style={[styles.stLabel, { backgroundColor: c.ok }]}>{t('accuracy').toUpperCase()}</Text>
          <Text style={[styles.stVal, { color: c.ink, backgroundColor: c.surface }]}>{r.accuracy}%</Text>
        </View>
      </View>
      {!r.isCp && (
        <Text style={[styles.earned, { color: c.muted }]}>
          {t('added')} <Text style={{ color: c.ink, fontFamily: F.black }}>{COURSE.orn[r.id].kz}</Text>
        </Text>
      )}
      <Button c={c} title={t('next')} onPress={onNext} style={styles.wide} />
    </ScrollView>
  );
}

/* ---------- Out of hearts ---------- */
export function NoHeartsScreen({ c, lang, nextInMs, onClose, onRefill }: {
  c: Colors; lang: Lang; nextInMs: number; onClose: () => void; onRefill?: () => void;
}) {
  const t = makeT(lang);
  const mins = Math.floor(nextInMs / 60000), secs = Math.floor((nextInMs % 60000) / 1000);
  return (
    <ScrollView contentContainerStyle={styles.center}>
      <Icon name="heart" color={c.heart} size={96} />
      <Text style={[styles.doneTitle, { color: c.heart }]}>{t('noHearts')}</Text>
      <Text style={[styles.earned, { color: c.muted }]}>{t('noHeartsTxt')}</Text>
      <Text style={[styles.timer, { color: c.ink }]}>{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</Text>
      {onRefill && <Button c={c} title={`${t('refill')} (dev)`} onPress={onRefill} style={styles.wide} />}
      <Button c={c} kind="ghost" title={t('close')} onPress={onClose} style={styles.wide} />
    </ScrollView>
  );
}

/* ---------- Collection ---------- */
export function CollectionScreen({ c, lang, done, onOpen }: { c: Colors; lang: Lang; done: Record<string, boolean>; onOpen: (id: string) => void }) {
  const t = makeT(lang);
  const { width } = useWindowDimensions();
  const tileW = Math.floor((width - 32 - 24) / 3);
  const n = ALL_ORNAMENTS.filter(id => done[id]).length;
  return (
    <ScrollView contentContainerStyle={styles.coll}>
      <Text style={[styles.h1, { color: c.ink }]}>{t('collection')}</Text>
      <Text style={[styles.sub, { color: c.muted }]}>{t('learned', { n, t: ALL_ORNAMENTS.length })}</Text>
      <View style={styles.grid}>
        {ALL_ORNAMENTS.map(id => {
          const o = COURSE.orn[id];
          const got = !!done[id];
          return (
            <Pressable key={id} onPress={() => onOpen(id)} accessibilityRole="button" accessibilityLabel={o.kz}
              style={[styles.tile, { width: tileW, backgroundColor: c.surface, borderColor: c.line }]}>
              <Ornament id={id} size={tileW - 24} dim={!got} />
              <Text style={[styles.tn, { color: got ? c.ink : c.muted }]} numberOfLines={2}>{o.kz}</Text>
              <Text style={[styles.tg, { color: c.muted }]} numberOfLines={2}>{got ? (lang === 0 ? o.tr : tri(o.gl, lang)) : t('notYet')}</Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

/* ---------- Bottom sheets ---------- */
function Sheet({ c, visible, onClose, children }: { c: Colors; visible: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={[styles.scrim, { backgroundColor: c.scrim }]} onPress={onClose} accessibilityLabel="close">
        <Pressable style={[styles.sheet, { backgroundColor: c.surface }]} onPress={() => {}}>
          <ScrollView contentContainerStyle={styles.sheetBody} keyboardShouldPersistTaps="handled">{children}</ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function OrnamentSheet({ c, lang, id, got, onClose }: { c: Colors; lang: Lang; id: string | null; got: boolean; onClose: () => void }) {
  const t = makeT(lang);
  const o = id ? COURSE.orn[id] : null;
  return (
    <Sheet c={c} visible={!!o} onClose={onClose}>
      {o && id && (
        <View style={styles.sheetCenter}>
          <Ornament id={id} size={170} dim={!got} />
          <Text style={[styles.h1, { color: c.ink, textAlign: 'center' }]}>{o.kz}</Text>
          <Text style={[styles.sub, { color: c.muted }]}>{o.tr}{lang === 0 ? '' : ' · ' + tri(o.gl, lang)}</Text>
          {got ? (
            <>
              <Text style={[styles.body, { color: c.ink }]}>{tri(o.d, lang)}</Text>
              <View style={[styles.symbol, { borderColor: c.line }]}>
                <Text style={[styles.symLabel, { color: c.gold }]}>{t('symbol').toUpperCase()}</Text>
                <Text style={[styles.symText, { color: c.ink }]}>{tri(o.s, lang)}</Text>
              </View>
            </>
          ) : (
            <Text style={[styles.sub, { color: c.muted }]}>{t('notYet')}</Text>
          )}
        </View>
      )}
      <Button c={c} title={t('close')} onPress={onClose} />
    </Sheet>
  );
}

export function SettingsSheet({ c, lang, visible, onClose, onLang, onReset, syncOn, email, onSendCode, onVerify, onSignOut, syncNote }: {
  c: Colors; lang: Lang; visible: boolean; onClose: () => void; onLang: (l: Lang) => void; onReset: () => void;
  syncOn: boolean; email: string | null;
  onSendCode: (email: string) => Promise<void>; onVerify: (email: string, code: string) => Promise<void>; onSignOut: () => void;
  syncNote: string | null;
}) {
  const t = makeT(lang);
  const [armed, setArmed] = useState(false);
  const [mail, setMail] = useState('');
  const [code, setCode] = useState('');
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const send = async () => {
    const e = mail.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(e)) { setErr(t('badEmail')); return; }
    setBusy(true); setErr(null);
    try { await onSendCode(e); setSentTo(e); } catch { setErr(t('syncFailed')); } finally { setBusy(false); }
  };
  const verify = async () => {
    if (!sentTo) return;
    setBusy(true); setErr(null);
    try { await onVerify(sentTo, code.trim()); setSentTo(null); setCode(''); setMail(''); } catch { setErr(t('badCode')); } finally { setBusy(false); }
  };
  const inputStyle = [styles.input, { borderColor: c.line, color: c.ink, backgroundColor: c.surface2 }];

  return (
    <Sheet c={c} visible={visible} onClose={() => { setArmed(false); onClose(); }}>
      <Text style={[styles.sheetTitle, { color: c.ink }]}>{t('settings')}</Text>

      <Text style={[styles.label, { color: c.primary }]}>{t('language').toUpperCase()}</Text>
      <View style={styles.seg}>
        {LANG_LABELS.map((n, i) => (
          <Pressable key={n} onPress={() => onLang(i as Lang)} accessibilityRole="button" accessibilityState={{ selected: lang === i }}
            style={[styles.segBtn, { borderColor: lang === i ? c.primary : c.line, backgroundColor: lang === i ? c.surface2 : c.surface }]}>
            <Text style={[styles.segText, { color: lang === i ? c.primary : c.ink }]}>{n}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.label, { color: c.primary }]}>{t('account').toUpperCase()}</Text>
      {!syncOn ? (
        <Text style={[styles.note, { color: c.muted }]}>{t('syncOff')}</Text>
      ) : email ? (
        <View style={styles.gap8}>
          <View style={styles.row}><Icon name="user" color={c.muted} /><Text style={[styles.note, { color: c.ink }]}>{t('signedInAs', { e: email })}</Text></View>
          {!!syncNote && <Text style={[styles.note, { color: c.muted }]}>{syncNote}</Text>}
          <Button c={c} kind="ghost" title={t('signOut')} onPress={onSignOut} />
        </View>
      ) : !sentTo ? (
        <View style={styles.gap8}>
          <Text style={[styles.note, { color: c.muted }]}>{t('accountHint')}</Text>
          <TextInput style={inputStyle} value={mail} onChangeText={setMail} placeholder={t('email')} placeholderTextColor={c.muted}
            keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
          <Button c={c} title={t('sendCode')} onPress={send} disabled={busy || !mail} />
        </View>
      ) : (
        <View style={styles.gap8}>
          <Text style={[styles.note, { color: c.muted }]}>{t('codeSent', { e: sentTo })}</Text>
          <TextInput style={[inputStyle, styles.codeInput]} value={code} onChangeText={setCode} placeholder={t('code')} placeholderTextColor={c.muted}
            keyboardType="number-pad" maxLength={8} autoComplete="one-time-code" textContentType="oneTimeCode" />
          <Button c={c} title={t('signIn')} onPress={verify} disabled={busy || code.trim().length < 6} />
        </View>
      )}
      {busy && <ActivityIndicator color={c.primary} />}
      {!!err && <Text style={[styles.note, { color: c.bad }]}>{err}</Text>}

      <Pressable onPress={() => { if (armed) { setArmed(false); onReset(); } else setArmed(true); }} accessibilityRole="button"
        style={[styles.rowBtn, { borderColor: c.line }]}>
        <Text style={[styles.rowBtnText, { color: c.bad }]}>{armed ? t('resetSure') : t('reset')}</Text>
      </Pressable>
      <Button c={c} title={t('close')} onPress={() => { setArmed(false); onClose(); }} />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  center: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', gap: 18, padding: 24 },
  cpArt: { width: 160, height: 160, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  doneTitle: { fontFamily: F.display, fontSize: 24, lineHeight: 32, textAlign: 'center' },
  stats: { flexDirection: 'row', gap: 12, alignSelf: 'stretch' },
  st: { flex: 1, borderWidth: 2, borderRadius: 16, overflow: 'hidden' },
  stLabel: { color: '#FFFFFF', fontFamily: F.black, fontSize: 12, letterSpacing: 1, textAlign: 'center', paddingVertical: 4 },
  stVal: { fontFamily: F.black, fontSize: 22, textAlign: 'center', paddingVertical: 10, fontVariant: ['tabular-nums'] },
  earned: { fontFamily: F.bold, fontSize: 15, textAlign: 'center' },
  timer: { fontFamily: F.display, fontSize: 28, fontVariant: ['tabular-nums'] },
  wide: { alignSelf: 'stretch' },
  coll: { padding: 16, gap: 12, paddingBottom: 40 },
  h1: { fontFamily: F.display, fontSize: 22, lineHeight: 30 },
  sub: { fontFamily: F.bold, fontSize: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: { borderWidth: 2, borderBottomWidth: 4, borderRadius: 18, paddingTop: 10, paddingBottom: 12, paddingHorizontal: 6, alignItems: 'center', gap: 6 },
  tn: { fontFamily: F.black, fontSize: 13, textAlign: 'center', lineHeight: 16 },
  tg: { fontFamily: F.bold, fontSize: 12, textAlign: 'center', lineHeight: 15 },
  scrim: { flex: 1, justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%' },
  sheetBody: { padding: 20, paddingBottom: 32, gap: 14 },
  sheetCenter: { alignItems: 'center', gap: 12 },
  sheetTitle: { fontFamily: F.display, fontSize: 18 },
  body: { fontFamily: F.body, fontSize: 16, lineHeight: 23, alignSelf: 'stretch' },
  symbol: { alignSelf: 'stretch', borderWidth: 2, borderRadius: 16, padding: 14, gap: 4 },
  symLabel: { fontFamily: F.black, fontSize: 12, letterSpacing: 1 },
  symText: { fontFamily: F.bold, fontSize: 16, lineHeight: 22 },
  label: { fontFamily: F.black, fontSize: 13, letterSpacing: 1 },
  seg: { flexDirection: 'row', gap: 8 },
  segBtn: { flex: 1, borderWidth: 2, borderBottomWidth: 4, borderRadius: 14, paddingVertical: 10, alignItems: 'center' },
  segText: { fontFamily: F.black, fontSize: 15 },
  note: { fontFamily: F.bold, fontSize: 14, lineHeight: 20, flexShrink: 1 },
  gap8: { gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { borderWidth: 2, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontFamily: F.bold, fontSize: 16 },
  codeInput: { letterSpacing: 6, fontSize: 20, textAlign: 'center' },
  rowBtn: { borderWidth: 2, borderBottomWidth: 4, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 14 },
  rowBtnText: { fontFamily: F.bold, fontSize: 15 },
});
