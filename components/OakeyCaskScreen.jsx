import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Svg, {
  Path, Line, Circle, G, Defs, ClipPath,
  Text as SvgText, LinearGradient, Stop, Rect, Polygon,
} from 'react-native-svg';

const { width: SW } = Dimensions.get('window');
const SIZE = Math.min(SW * 0.78, 300);

const C = {
  bg: '#1a0a00',
  woodDark: '#8b5e2a',
  wood: '#c8973a',
  woodLight: '#e0b060',
  amberDark: '#b8800a',
  amber: '#d4a017',
  amberLight: '#f0c040',
  grid: 'rgba(255,220,140,0.22)',
  hoop: 'rgba(255,220,140,0.45)',
  textGold: '#c8973a',
  textMuted: 'rgba(200,151,58,0.65)',
};

// ── Barrel Front View ────────────────────────────────────────────────────────

function BarrelFront({ fillLevel, size }) {
  const W = size;
  const H = size * 0.92;
  const cx = W / 2;

  const topHW = W * 0.34;
  const midHW = W * 0.455;
  const topY = H * 0.04;
  const botY = H * 0.96;
  const midY = H * 0.5;
  const barrelH = botY - topY;

  // Barrel outline (cubic bezier, symmetric)
  const outline = [
    `M ${cx - topHW} ${topY}`,
    `L ${cx + topHW} ${topY}`,
    `C ${cx + midHW} ${topY + barrelH * 0.25} ${cx + midHW} ${botY - barrelH * 0.25} ${cx + topHW} ${botY}`,
    `L ${cx - topHW} ${botY}`,
    `C ${cx - midHW} ${botY - barrelH * 0.25} ${cx - midHW} ${topY + barrelH * 0.25} ${cx - topHW} ${topY}`,
    'Z',
  ].join(' ');

  const fillY = botY - barrelH * fillLevel;

  // Vertical stave lines (7 dividers = 8 staves)
  const staves = Array.from({ length: 7 }, (_, i) => {
    const x = (cx - topHW) + (2 * topHW) * ((i + 1) / 8);
    return <Line key={i} x1={x} y1={topY} x2={x} y2={botY} stroke={C.grid} strokeWidth={0.8} />;
  });

  // Horizontal grid lines
  const gridH = Array.from({ length: 11 }, (_, i) => {
    const y = topY + barrelH * ((i + 1) / 12);
    return <Line key={i} x1={0} y1={y} x2={W} y2={y} stroke={C.grid} strokeWidth={0.6} />;
  });

  // Hoop bands
  const hoopYs = [0.08, 0.22, 0.78, 0.92].map(t => topY + barrelH * t);
  const hoops = hoopYs.map((y, i) => {
    const t = (y - topY) / barrelH;
    const d = Math.abs(t - 0.5) * 2;
    const hw = topHW + (midHW - topHW) * (1 - d * d);
    return <Line key={i} x1={cx - hw} y1={y} x2={cx + hw} y2={y} stroke={C.hoop} strokeWidth={2.5} />;
  });

  return (
    <Svg width={W} height={H}>
      <Defs>
        <LinearGradient id="wg" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={C.woodDark} />
          <Stop offset="0.35" stopColor={C.wood} />
          <Stop offset="0.5" stopColor={C.woodLight} />
          <Stop offset="0.65" stopColor={C.wood} />
          <Stop offset="1" stopColor={C.woodDark} />
        </LinearGradient>
        <LinearGradient id="ag" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={C.amberDark} />
          <Stop offset="0.35" stopColor={C.amber} />
          <Stop offset="0.5" stopColor={C.amberLight} />
          <Stop offset="0.65" stopColor={C.amber} />
          <Stop offset="1" stopColor={C.amberDark} />
        </LinearGradient>
        <ClipPath id="barrel">
          <Path d={outline} />
        </ClipPath>
        <ClipPath id="fillMask">
          <Rect x={0} y={fillY} width={W} height={botY - fillY + 10} />
        </ClipPath>
      </Defs>

      {/* Wood fill */}
      <G clipPath="url(#barrel)">
        <Rect x={0} y={0} width={W} height={H} fill="url(#wg)" />
        {gridH}
        {staves}
        {fillLevel > 0 && (
          <G clipPath="url(#fillMask)">
            <Rect x={0} y={0} width={W} height={H} fill="url(#ag)" />
          </G>
        )}
      </G>

      {/* Outline */}
      <Path d={outline} fill="none" stroke={C.hoop} strokeWidth={2} />
      {hoops}

      {/* Bung hole */}
      <Circle cx={cx} cy={midY} r={9} fill="#1a0a00" />
      <Circle cx={cx} cy={midY} r={6.5} fill="#0d0500" />
    </Svg>
  );
}

// ── Radar / Taste Profile (Top-Down View) ────────────────────────────────────

function RadarChart({ data, size }) {
  const labels = ['Peat', 'Fruit', 'Spice', 'Floral', 'Sweet', 'Body'];
  const values = [data.peat, data.fruit, data.spice, data.floral, data.sweet, data.body];
  const n = 6;
  const R = size * 0.36;
  const cx = size / 2;
  const cy = size / 2;
  const angles = Array.from({ length: n }, (_, i) => (i * 2 * Math.PI / n) - Math.PI / 2);

  const rings = [0.25, 0.5, 0.75, 1.0].map((r, i) => {
    const pts = angles.map(a => `${cx + R * r * Math.cos(a)},${cy + R * r * Math.sin(a)}`).join(' ');
    return <Polygon key={i} points={pts} fill="none" stroke="rgba(255,220,140,0.18)" strokeWidth={1} />;
  });

  const axes = angles.map((a, i) => (
    <Line key={i} x1={cx} y1={cy}
      x2={cx + R * Math.cos(a)} y2={cy + R * Math.sin(a)}
      stroke="rgba(255,220,140,0.18)" strokeWidth={1} />
  ));

  const dataPts = angles.map((a, i) =>
    `${cx + R * values[i] * Math.cos(a)},${cy + R * values[i] * Math.sin(a)}`
  ).join(' ');

  const labelDist = R + 24;
  const labelEls = angles.map((a, i) => (
    <SvgText key={i}
      x={cx + labelDist * Math.cos(a)}
      y={cy + labelDist * Math.sin(a) + 4}
      fill={C.woodLight} fontSize={11} fontWeight="600" textAnchor="middle">
      {labels[i]}
    </SvgText>
  ));

  return (
    <Svg width={size} height={size}>
      <Defs>
        <LinearGradient id="topGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#C88C10" />
          <Stop offset="1" stopColor="#A07010" />
        </LinearGradient>
      </Defs>

      {/* Background circle */}
      <Circle cx={cx} cy={cy} r={size / 2 - 4} fill="url(#topGrad)" />

      {/* Outer rings */}
      <Circle cx={cx} cy={cy} r={size / 2 - 4} fill="none" stroke="rgba(200,160,60,0.55)" strokeWidth={7} />
      <Circle cx={cx} cy={cy} r={size / 2 - 14} fill="none" stroke="rgba(255,220,140,0.15)" strokeWidth={1} />

      {rings}
      {axes}

      {/* Data polygon */}
      <Polygon points={dataPts} fill="rgba(255,220,140,0.18)" stroke="rgba(255,220,140,0.85)" strokeWidth={1.8} />

      {/* Data dots */}
      {angles.map((a, i) => (
        <Circle key={i}
          cx={cx + R * values[i] * Math.cos(a)}
          cy={cy + R * values[i] * Math.sin(a)}
          r={4} fill={C.amberLight} />
      ))}

      {labelEls}

      {/* Center label */}
      <SvgText x={cx} y={cy - 8} fill="rgba(255,220,140,0.55)" fontSize={9}
        textAnchor="middle" letterSpacing={2}>TASTE PROFILE</SvgText>
      <SvgText x={cx} y={cy + 12} fill={C.amberLight} fontSize={15}
        textAnchor="middle" fontWeight="bold">Smoke Poet</SvgText>
    </Svg>
  );
}

// ── Screen ───────────────────────────────────────────────────────────────────

const TASTE_DATA = {
  peat: 0.75, fruit: 0.55, spice: 0.6,
  floral: 0.4, sweet: 0.5, body: 0.65,
};

export default function OakeyCaskScreen() {
  const [ratings, setRatings] = useState(0);
  const isFull = ratings >= 3;
  const fillLevel = Math.min(ratings / 3, 1);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' }}>

      {/* Cask / Radar */}
      <View style={{ marginBottom: 28 }}>
        {isFull
          ? <RadarChart data={TASTE_DATA} size={SIZE} />
          : <BarrelFront fillLevel={fillLevel} size={SIZE} />
        }
      </View>

      {/* Labels */}
      {!isFull && (
        <View style={{ alignItems: 'center', marginBottom: 36 }}>
          <Text style={{ color: C.textGold, fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
            {ratings === 0 ? 'Your cask is empty' : `${ratings} whisky${ratings > 1 ? 'ies' : ''} rated`}
          </Text>
          <Text style={{ color: C.textMuted, fontSize: 13, textAlign: 'center', lineHeight: 20, maxWidth: 250 }}>
            {ratings === 0
              ? 'Rate 3 whiskies to fill your cask and discover\nyour taste profile'
              : `Rate ${3 - ratings} more whisky${3 - ratings > 1 ? 'ies' : ''} to reveal your taste profile`}
          </Text>
        </View>
      )}

      {isFull && (
        <View style={{ alignItems: 'center', marginBottom: 36 }}>
          <Text style={{ color: C.textMuted, fontSize: 10, letterSpacing: 3, marginBottom: 6 }}>
            YOUR TASTE PROFILE
          </Text>
          <Text style={{ color: C.amberLight, fontSize: 28, fontWeight: '800' }}>
            Smoke Poet
          </Text>
        </View>
      )}

      {/* Buttons */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Search / Rate button */}
        <TouchableOpacity
          onPress={() => !isFull && setRatings(r => r + 1)}
          style={{
            width: 56, height: 56, borderRadius: 28,
            backgroundColor: 'rgba(200,151,58,0.18)',
            borderWidth: 1, borderColor: 'rgba(200,151,58,0.4)',
            alignItems: 'center', justifyContent: 'center',
          }}>
          <Text style={{ fontSize: 22 }}>🔍</Text>
        </TouchableOpacity>

        {/* Reset button (appears once ratings > 0) */}
        {ratings > 0 && (
          <TouchableOpacity
            onPress={() => setRatings(0)}
            style={{
              width: 44, height: 44, borderRadius: 22,
              backgroundColor: 'rgba(200,151,58,0.1)',
              borderWidth: 1, borderColor: 'rgba(200,151,58,0.28)',
              alignItems: 'center', justifyContent: 'center',
              marginLeft: 14,
            }}>
            <Text style={{ fontSize: 18, color: C.textGold }}>↺</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
