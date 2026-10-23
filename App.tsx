import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { SvgXml } from 'react-native-svg';
import { useFonts, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black } from '@expo-google-fonts/nunito';
import { Unbounded_700Bold } from '@expo-google-fonts/unbounded';
import type { Session } from '@supabase/supabase-js';

import { LOGO_XML } from './src/art';
import { Icon, Stat } from './src/components/ui';
import { LANG_LABELS, makeT, type Lang } from './src/i18n';
import * as Lesson from './src/lesson';
import { finishLesson, freshProgress, liveStreak, loseHeart, MAX_HEARTS, nextHeartIn, regenHearts, type Progress } from './src/progress';
import { loadProgress, saveProgress } from './src/storage';
import * as Sync from './src/sync';
import { F, useColors } from './src/theme';
import { PathScreen } from './src/screens/PathScreen';
import { LessonScreen } from './src/screens/LessonScreen';
import { CollectionScreen, DoneScreen, NoHeartsScreen, OrnamentSheet, SettingsSheet } from './src/screens/OtherScreens';

type View_ = 'path' | 'collection' | 'lesson' | 'done' | 'nohearts';

export default function App() {
  const [fontsLoaded] = useFonts({ Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black, Unbounded_700Bold });
  const c = useColors();
  const [p, setP] = useState<Progress | null>(null);
  const [view, setView] = useState<View_>('path');
  const [lesson, setLesson] = useState<Lesson.LessonState | null>(null);
  const [result, setResult] = useState<Lesson.LessonResult | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [ornId, setOrnId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [syncNote, setSyncNote] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const pRef = useRef<Progress | null>(null);
  pRef.current = p;

  // Load progress, then keep it saved.
  useEffect(() => { loadProgress().then(x => setP(regenHearts(x, Date.now()))); }, []);
  useEffect(() => { if (p) saveProgress(p); }, [p]);

  // Heart refill clock.
  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
      setP(x => (x ? regenHearts(x, Date.now()) : x));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const lang: Lang = p?.lang ?? 1;
  const t = makeT(lang);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(cur => (cur === msg ? null : cur)), 2200);
  }, []);

  // Sync with the cloud when signed in.
  const runSync = useCallback(async (s: Session | null) => {
    const cur = pRef.current;
    if (!s || !cur) return;
    try {
      const merged = await Sync.syncProgress(cur, s);
      setP(x => (x ? { ...x, done: { ...x.done, ...merged.done }, xp: Math.max(x.xp, merged.xp), streak: merged.streak, lastDay: merged.lastDay } : merged));
      setSyncNote(makeT(pRef.current?.lang ?? 1)('synced'));
    } catch {
      setSyncNote(makeT(pRef.current?.lang ?? 1)('syncFailed'));
    }
  }, []);

  const loaded = p !== null;
  useEffect(() => {
    if (!loaded) return;
    Sync.getSession().then(s => { setSession(s); runSync(s); });
    return Sync.onAuthChange(s => setSession(s));
  }, [loaded, runSync]);

  // Android back button.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (view === 'lesson' || view === 'done' || view === 'nohearts' || view === 'collection') {
        setLesson(null); setView('path'); return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [view]);

  if (!fontsLoaded || !p) {
    return (
      <View style={[styles.splash, { backgroundColor: c.m1 }]}>
        <ActivityIndicator color="#FFFFFF" />
      </View>
    );
  }

  const update = (fn: (x: Progress) => Progress) => setP(x => (x ? fn(x) : x));

  const open = (id: string) => {
    if (!Lesson.isUnlocked(id, p.done)) { showToast(t('locked')); return; }
    if (p.hearts <= 0) { setView('nohearts'); return; }
    setLesson(Lesson.createLesson(id));
    setView('lesson');
  };

  const onCheck = () => {
    if (!lesson) return;
    const { lesson: l, correct } = Lesson.check(lesson);
    setLesson(l);
    if (!correct) update(x => loseHeart(x, Date.now()));
  };

  const onNext = () => {
    if (!lesson) return;
    if (lesson.checked && !lesson.ok && p.hearts <= 0) { setLesson(null); setView('nohearts'); return; }
    const { lesson: l, finished } = Lesson.advance(lesson);
    if (!finished) { setLesson(l); return; }
    const r = Lesson.result(lesson);
    const next = finishLesson(p, r.id, r.gain, new Date());
    setP(next);
    pRef.current = next;
    setResult(r);
    setLesson(null);
    setView('done');
    if (session) runSync(session);
  };

  const streak = liveStreak(p, new Date(now));
  const showChrome = view === 'path' || view === 'collection';

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <SafeAreaView style={[styles.flex, { backgroundColor: c.bg }]} edges={['top', 'bottom', 'left', 'right']}>
        {showChrome && (
          <View style={[styles.header, { backgroundColor: c.surface, borderBottomColor: c.line }]}>
            <View style={styles.logo}>
              <SvgXml xml={LOGO_XML(c.m1)} width={26} height={26} />
              <Text style={[styles.logoText, { color: c.m1 }]}>Oyu</Text>
            </View>
            <Pressable onPress={() => update(x => ({ ...x, lang: (((x.lang + 1) % 3) as Lang) }))} accessibilityRole="button"
              accessibilityLabel={t('language')} style={[styles.langChip, { borderColor: c.line }]}>
              <Text style={[styles.langText, { color: c.muted }]}>{LANG_LABELS[lang]}</Text>
            </Pressable>
            <Stat icon="flame" color={c.streak} value={streak} />
            <Stat icon="gem" color={c.gold} value={p.xp} />
            <Stat icon="heart" color={c.heart} value={p.hearts} />
            <Pressable onPress={() => setSettingsOpen(true)} accessibilityRole="button" accessibilityLabel={t('settings')} hitSlop={8}>
              <Icon name="gear" color={c.muted} size={24} />
            </Pressable>
          </View>
        )}

        <View style={styles.flex}>
          {view === 'path' && <PathScreen c={c} lang={lang} done={p.done} onOpen={open} />}
          {view === 'collection' && <CollectionScreen c={c} lang={lang} done={p.done} onOpen={setOrnId} />}
          {view === 'lesson' && lesson && (
            <LessonScreen c={c} lang={lang} lesson={lesson} hearts={p.hearts}
              onSelect={i => setLesson(l => (l ? Lesson.select(l, i) : l))}
              onCheck={onCheck} onNext={onNext} onQuit={() => { setLesson(null); setView('path'); }} />
          )}
          {view === 'done' && result && <DoneScreen c={c} lang={lang} r={result} onNext={() => setView('path')} />}
          {view === 'nohearts' && (
            <NoHeartsScreen c={c} lang={lang} nextInMs={nextHeartIn(p, now)} onClose={() => setView('path')}
              onRefill={__DEV__ ? () => { update(x => ({ ...x, hearts: MAX_HEARTS, heartsAt: Date.now() })); setView('path'); } : undefined} />
          )}
        </View>

        {showChrome && (
          <View style={[styles.tabbar, { backgroundColor: c.surface, borderTopColor: c.line }]}>
            {(['path', 'collection'] as const).map(v => (
              <Pressable key={v} style={styles.tab} onPress={() => setView(v)} accessibilityRole="tab" accessibilityState={{ selected: view === v }}>
                <Icon name={v === 'path' ? 'path' : 'grid'} color={view === v ? c.primary : c.muted} size={28} />
                <Text style={[styles.tabText, { color: view === v ? c.primary : c.muted }]}>{t(v === 'path' ? 'path' : 'collection').toUpperCase()}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {toast && (
          <View style={[styles.toast, { backgroundColor: c.ink }]} pointerEvents="none" accessibilityLiveRegion="polite">
            <Text style={[styles.toastText, { color: c.bg }]}>{toast}</Text>
          </View>
        )}
      </SafeAreaView>

      <OrnamentSheet c={c} lang={lang} id={ornId} got={!!(ornId && p.done[ornId])} onClose={() => setOrnId(null)} />
      <SettingsSheet
        c={c} lang={lang} visible={settingsOpen} onClose={() => setSettingsOpen(false)}
        onLang={l => update(x => ({ ...x, lang: l }))}
        onReset={() => { setP({ ...freshProgress(lang), updatedAt: Date.now() }); setSettingsOpen(false); setView('path'); }}
        syncOn={Sync.syncEnabled}
        email={session?.user.email ?? null}
        onSendCode={Sync.sendCode}
        onVerify={async (email, code) => { const s = await Sync.verifyCode(email, code); setSession(s); await runSync(s); }}
        onSignOut={() => { Sync.signOut(); setSession(null); setSyncNote(null); }}
        syncNote={syncNote}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 2 },
  logo: { flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 'auto' },
  logoText: { fontFamily: F.display, fontSize: 20 },
  langChip: { borderWidth: 2, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  langText: { fontFamily: F.black, fontSize: 12, letterSpacing: 0.8 },
  tabbar: { flexDirection: 'row', borderTopWidth: 2 },
  tab: { flex: 1, alignItems: 'center', paddingTop: 10, paddingBottom: 12, gap: 2 },
  tabText: { fontFamily: F.black, fontSize: 12, letterSpacing: 0.8 },
  toast: { position: 'absolute', bottom: 96, alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, maxWidth: '90%' },
  toastText: { fontFamily: F.bold, fontSize: 14, textAlign: 'center' },
});
