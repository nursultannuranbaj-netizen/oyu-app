import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { ornamentXml } from '../art';
import { F, type Colors } from '../theme';

export function Ornament({ id, size, dim }: { id: string; size: number; dim?: boolean }) {
  return (
    <View style={dim ? { opacity: 0.35 } : undefined}>
      <SvgXml xml={ornamentXml(id)} width={size} height={size} />
    </View>
  );
}

const ICONS: Record<string, (c: string) => string> = {
  flame: c => `<svg viewBox="0 0 24 24"><path d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 2-5 3-6 0 2 1 3 2 3-1-3 0-6 1-9z" fill="${c}"/></svg>`,
  gem: c => `<svg viewBox="0 0 24 24"><path d="M12 2l2.6 6.2L21 9l-5 4.6L17.4 21 12 17.6 6.6 21 8 13.6 3 9l6.4-.8z" fill="${c}"/></svg>`,
  heart: c => `<svg viewBox="0 0 24 24"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" fill="${c}"/></svg>`,
  gear: c => `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/></svg>`,
  close: c => `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
  check: c => `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`,
  path: c => `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="5" r="2.6"/><circle cx="7" cy="12" r="2.6"/><circle cx="12" cy="19" r="2.6"/><path d="M10.2 6.9 8.6 9.9M8.6 14.1l1.6 3"/></svg>`,
  grid: c => `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.2"><rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/></svg>`,
  user: c => `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>`,
};
export type IconName = keyof typeof ICONS;

export function Icon({ name, color, size = 22 }: { name: IconName; color: string; size?: number }) {
  return <SvgXml xml={ICONS[name](color)} width={size} height={size} />;
}

type BtnKind = 'primary' | 'ok' | 'bad' | 'ghost';
export function Button({ title, onPress, kind = 'primary', disabled, c, style }: {
  title: string; onPress: () => void; kind?: BtnKind; disabled?: boolean; c: Colors; style?: StyleProp<ViewStyle>;
}) {
  const bg = disabled ? c.locked : kind === 'ok' ? c.ok : kind === 'bad' ? c.bad : kind === 'ghost' ? 'transparent' : c.primary;
  const edge = disabled ? c.lockedEdge : kind === 'ok' ? c.okEdge : kind === 'bad' ? c.badEdge : kind === 'ghost' ? c.line : c.primaryEdge;
  const fg = disabled ? c.muted : kind === 'ghost' ? c.muted : kind === 'primary' ? c.primaryInk : '#FFFFFF';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, borderBottomColor: edge, borderBottomWidth: pressed ? 1 : 4, marginTop: pressed ? 3 : 0 },
        kind === 'ghost' && { borderWidth: 2, borderColor: c.line },
        style,
      ]}
    >
      <Text style={[styles.btnText, { color: fg }]}>{title.toUpperCase()}</Text>
    </Pressable>
  );
}

export function Stat({ icon, color, value }: { icon: IconName; color: string; value: number | string }) {
  return (
    <View style={styles.stat}>
      <Icon name={icon} color={color} size={20} />
      <Text style={[styles.statText, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: { borderRadius: 16, paddingVertical: 14, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontFamily: F.black, fontSize: 15, letterSpacing: 1 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontFamily: F.black, fontSize: 15, fontVariant: ['tabular-nums'] },
});
