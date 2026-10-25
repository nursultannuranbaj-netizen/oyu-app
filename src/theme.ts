import { useColorScheme } from 'react-native';

const light = {
  bg: '#EAF1F0', surface: '#FFFFFF', surface2: '#F3F7F6', ink: '#14222B', muted: '#5A6C74', line: '#D3DFDD',
  primary: '#0B93B0', primaryInk: '#FFFFFF', primaryEdge: '#076F86',
  gold: '#E3A51F', goldEdge: '#B07A08', heart: '#E0444C', streak: '#E8761E',
  ok: '#2B9545', okBg: '#DCF2DF', okEdge: '#1F7334', bad: '#CF3A42', badBg: '#FBE1E2', badEdge: '#A12A31',
  locked: '#CBD6D5', lockedEdge: '#A9B8B7', m1: '#C2303A', m2: '#1E4FA3', m3: '#2F7D4A', m4: '#1B3A7A', m5: '#8A4B2A', scrim: 'rgba(8,16,20,0.5)',
};
const dark: typeof light = {
  bg: '#0D1920', surface: '#15242D', surface2: '#1A2C36', ink: '#E5EEF0', muted: '#93A6AE', line: '#263A44',
  primary: '#23B2D0', primaryInk: '#06222B', primaryEdge: '#15859E',
  gold: '#F0B83A', goldEdge: '#B4840C', heart: '#F0606A', streak: '#F08A3A',
  ok: '#58C46D', okBg: '#15301F', okEdge: '#2E7A41', bad: '#F06870', badBg: '#3A1B1F', badEdge: '#A3393F',
  locked: '#2A3D47', lockedEdge: '#1C2C34', m1: '#B42C36', m2: '#2457B0', m3: '#2C7346', m4: '#2A4E96', m5: '#8A4B2A', scrim: 'rgba(0,0,0,0.6)',
};
export type Colors = typeof light;

export function useColors(): Colors {
  return useColorScheme() === 'dark' ? dark : light;
}

export const F = {
  display: 'Unbounded_700Bold',
  body: 'Nunito_700Bold',
  bold: 'Nunito_800ExtraBold',
  black: 'Nunito_900Black',
};
