/**
 * Snippets de uso por componente en 3 frameworks: React (inline styles, como
 * vive en este atelier), Tailwind CSS (clases utilities), React Native
 * (View/Text/Pressable con StyleSheet).
 *
 * Son strings hardcoded — cada componente nuevo agrega una entrada aca. Cuando
 * la cantidad pase 30+ componentes, considerar generador via AST o template
 * compiler. Por ahora pragmatico.
 */

export interface ComponentSnippets {
  react: string;
  tailwind: string;
  reactNative: string;
}

export const snippets: Record<string, ComponentSnippets> = {
  separador: {
    react: `import { Separador } from "@totalcoin/ds";

<Separador />
<Separador text="O" />
<Separador text="Continuar con" gap="md" />`,
    tailwind: `<div className="w-full py-2">
  <div className="h-px w-full bg-[#e0e0e0]" />
</div>

{/* Con label */}
<div className="flex items-center gap-3 py-2">
  <div className="flex-1 h-px bg-[#e0e0e0]" />
  <span className="text-xs text-[#828282]">O</span>
  <div className="flex-1 h-px bg-[#e0e0e0]" />
</div>`,
    reactNative: `import { View, Text, StyleSheet } from "react-native";

<View style={styles.separator}>
  <View style={styles.line} />
</View>

const styles = StyleSheet.create({
  separator: { paddingVertical: 8, width: "100%" },
  line: { height: 1, backgroundColor: "#e0e0e0" },
});`,
  },

  spinner: {
    react: `import { Spinner } from "@totalcoin/ds";

<Spinner />
<Spinner size={48} color="#00974e" />`,
    tailwind: `<div
  role="status"
  aria-label="Cargando"
  className="inline-block w-[108px] h-[108px]"
>
  <span className="block w-full h-full rounded-full border-[11px] border-transparent border-t-[#003e70] animate-spin" />
</div>`,
    reactNative: `import { ActivityIndicator } from "react-native";

<ActivityIndicator size="large" color="#003e70" />

{/* O custom con Animated.View + Animated.loop si se quiere matching exacto */}`,
  },

  checkbox: {
    react: `import { CheckBox } from "@totalcoin/ds";
import { useState } from "react";

const [checked, setChecked] = useState(false);

<CheckBox
  checked={checked}
  onChange={setChecked}
  ariaLabel="Acepto los terminos"
/>`,
    tailwind: `<button
  type="button"
  role="checkbox"
  aria-checked={checked}
  onClick={() => setChecked(!checked)}
  className={
    "inline-flex items-center justify-center w-[21px] h-[21px] rounded " +
    "border transition-colors " +
    (checked
      ? "bg-[#003e70] border-[#003e70] text-[#f2f2f2]"
      : "bg-transparent border-[#bdbdbd] text-[#f2f2f2]")
  }
>
  {checked && (
    <svg viewBox="0 0 24 24" className="w-[11px] h-[11px]" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l4.5 4.5L19 7" />
    </svg>
  )}
</button>`,
    reactNative: `import { Pressable, View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

<Pressable
  accessibilityRole="checkbox"
  accessibilityState={{ checked }}
  onPress={() => setChecked(!checked)}
  style={[styles.box, checked && styles.boxChecked]}
>
  {checked && (
    <Svg viewBox="0 0 24 24" width={11} height={11} fill="none" stroke="#f2f2f2" strokeWidth={3}>
      <Path d="M5 12l4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )}
</Pressable>

const styles = StyleSheet.create({
  box: {
    width: 21, height: 21, borderRadius: 4,
    borderWidth: 1, borderColor: "#bdbdbd",
    alignItems: "center", justifyContent: "center",
  },
  boxChecked: { backgroundColor: "#003e70", borderColor: "#003e70" },
});`,
  },

  toggle: {
    react: `import { Toggle } from "@totalcoin/ds";
import { useState } from "react";

const [on, setOn] = useState(true);

<Toggle checked={on} onCheckedChange={setOn} ariaLabel="Notificaciones" />`,
    tailwind: `<button
  type="button"
  role="switch"
  aria-checked={on}
  onClick={() => setOn(!on)}
  className={
    "relative w-[51px] h-[31px] rounded-full p-0 transition-colors " +
    (on ? "bg-[#003e70]" : "bg-[#828282]")
  }
>
  <span
    aria-hidden
    className={
      "absolute top-[2px] left-[2px] w-[27px] h-[27px] rounded-full bg-[#fefefe] " +
      "transition-transform shadow " +
      (on ? "translate-x-[20px]" : "translate-x-0")
    }
  />
</button>`,
    reactNative: `import { Switch } from "react-native";

<Switch
  value={on}
  onValueChange={setOn}
  trackColor={{ false: "#828282", true: "#003e70" }}
  thumbColor="#fefefe"
/>`,
  },

  radiobutton: {
    react: `import { RadioButton } from "@totalcoin/ds";
import { useState } from "react";

const [value, setValue] = useState("a");

<label>
  <RadioButton name="grupo" value="a" checked={value === "a"} onChange={() => setValue("a")} />
  Opcion A
</label>`,
    tailwind: `<label className="inline-flex items-center gap-2 cursor-pointer">
  <span
    className={
      "inline-flex items-center justify-center w-[25px] h-[25px] rounded-full border " +
      (value === "a" ? "bg-[#003e70] border-[#003e70] text-white" : "border-[#e0e0e0]")
    }
  >
    <input type="radio" name="g" className="sr-only" checked={value === "a"} onChange={() => setValue("a")} />
    {value === "a" && (
      <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3}>
        <path d="M5 12l4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  </span>
  <span>Opcion A</span>
</label>`,
    reactNative: `import { Pressable, Text, View, StyleSheet } from "react-native";

<Pressable onPress={() => setValue("a")} style={styles.row}>
  <View style={[styles.radio, value === "a" && styles.radioChecked]} />
  <Text>Opcion A</Text>
</Pressable>

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  radio: {
    width: 25, height: 25, borderRadius: 12.5,
    borderWidth: 1, borderColor: "#e0e0e0",
  },
  radioChecked: { backgroundColor: "#003e70", borderColor: "#003e70" },
});`,
  },

  statuspill: {
    react: `import { StatusPill } from "@totalcoin/ds";

<StatusPill level="low">Bajo</StatusPill>
<StatusPill level="medium">Medio</StatusPill>
<StatusPill level="high">Crítico</StatusPill>
<StatusPill level="neutral">Neutro</StatusPill>`,
    tailwind: `<span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-[16px] bg-[#e6f5ed] text-[#00974e] font-medium text-sm">
  Bajo
</span>

{/* high */}
<span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-[16px] bg-[#ffebea] text-[#ff3a30] font-medium text-sm">
  Crítico
</span>`,
    reactNative: `import { View, Text, StyleSheet } from "react-native";

<View style={[styles.pill, styles.pillLow]}>
  <Text style={styles.pillTextLow}>Bajo</Text>
</View>

const styles = StyleSheet.create({
  pill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 16, alignSelf: "flex-start" },
  pillLow: { backgroundColor: "#e6f5ed" },
  pillTextLow: { color: "#00974e", fontSize: 14, fontWeight: "500" },
});`,
  },

  progreso: {
    react: `import { Progreso } from "@totalcoin/ds";

<Progreso value={65} />
<Progreso value={30} color="#ff3a30" />`,
    tailwind: `<div role="progressbar" className="w-full h-2 bg-[#e0e0e0] rounded-xl overflow-hidden">
  <div
    className="h-full bg-[#003e70] transition-[width]"
    style={{ width: \`\${value}%\` }}
  />
</div>`,
    reactNative: `import { View, StyleSheet } from "react-native";

<View style={styles.track}>
  <View style={[styles.fill, { width: \`\${value}%\` }]} />
</View>

const styles = StyleSheet.create({
  track: { height: 8, backgroundColor: "#e0e0e0", borderRadius: 12, overflow: "hidden" },
  fill: { height: "100%", backgroundColor: "#003e70" },
});`,
  },

  slider: {
    react: `import { Slider } from "@totalcoin/ds";
import { useState } from "react";

// Single
const [value, setValue] = useState(10000);

<Slider
  label="Valor"
  value={value}
  onChange={(v) => setValue(v as number)}
  min={0}
  max={100000}
  step={500}
/>

// Range
const [range, setRange] = useState<[number, number]>([10000, 10000000]);

<Slider
  labels={["Min.", "Max."]}
  value={range}
  onChange={(v) => setRange(v as [number, number])}
  min={10000}
  max={10000000}
  step={10000}
/>`,
    tailwind: `{/* Single — custom pointer handlers omitidos por brevedad, ver source */}
<div className="w-full">
  <label className="block text-sm font-semibold text-[#828282] mb-4">Valor</label>
  <div className="relative w-full h-2.5 bg-[#e0e0e0] rounded-full">
    <div
      className="absolute top-0 bottom-0 left-0 bg-[#003e70] rounded-full"
      style={{ width: \`\${pct}%\` }}
    />
    <div
      role="slider"
      tabIndex={0}
      aria-valuemin={0}
      aria-valuemax={100000}
      aria-valuenow={value}
      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded-full bg-[#f26e25] shadow-sm cursor-grab focus:ring-2 focus:ring-[#cbd5e1] outline-none"
      style={{ left: \`\${pct}%\` }}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKey}
    />
  </div>
  <div className="relative mt-2 h-5 text-sm text-[#828282]">
    <span
      className="absolute -translate-x-1/2"
      style={{ left: \`\${pct}%\` }}
    >
      {value.toLocaleString("es-AR")}
    </span>
  </div>
</div>`,
    reactNative: `import { View, Text, StyleSheet, PanResponder } from "react-native";

// React Native no tiene slider nativo en core; usar @react-native-community/slider
// o implementar con PanResponder sobre un track custom.

import Slider from "@react-native-community/slider";

<Slider
  style={{ width: 320, height: 40 }}
  minimumValue={0}
  maximumValue={100000}
  step={500}
  value={value}
  onValueChange={setValue}
  minimumTrackTintColor="#003e70"
  maximumTrackTintColor="#e0e0e0"
  thumbTintColor="#f26e25"
/>`,
  },

  stepper: {
    react: `import { Stepper } from "@totalcoin/ds";

<Stepper steps={5} current={2} />`,
    tailwind: `<div className="relative w-full flex items-center justify-between h-2">
  <span className="absolute top-1/2 left-1 right-1 h-px bg-[#e0e0e0] -translate-y-1/2" />
  {Array.from({ length: 5 }).map((_, i) => (
    <span
      key={i}
      className={
        "relative w-2 h-2 rounded-full " +
        (i === current ? "bg-[#003e70]" : "bg-[#e0e0e0] border border-[#e0e0e0]")
      }
    />
  ))}
</div>`,
    reactNative: `import { View, StyleSheet } from "react-native";

<View style={styles.wrap}>
  <View style={styles.line} />
  {Array.from({ length: 5 }).map((_, i) => (
    <View key={i} style={[styles.dot, i === current && styles.active]} />
  ))}
</View>

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", height: 8 },
  line: { position: "absolute", left: 4, right: 4, top: "50%", height: 1, backgroundColor: "#e0e0e0" },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#e0e0e0" },
  active: { backgroundColor: "#003e70" },
});`,
  },

  buttonstandard: {
    react: `import { ButtonStandard } from "@totalcoin/ds";

<ButtonStandard variant="primary" onClick={handleClick}>
  Confirmar
</ButtonStandard>

<ButtonStandard variant="danger-outline" size="small">
  Eliminar
</ButtonStandard>

<ButtonStandard width="full" rounded leftIcon={<Icon />}>
  Full width con icono
</ButtonStandard>`,
    tailwind: `{/* Primary */}
<button className="inline-flex items-center justify-center gap-2 h-[45px] px-[10px] rounded-xl bg-[#003e70] text-[#f2f2f2] border border-[#e0e0e0] font-bold text-sm shadow-sm transition-colors hover:bg-[#002c50]">
  Confirmar
</button>

{/* Danger outline */}
<button className="inline-flex items-center justify-center gap-2 h-[40px] px-[10px] rounded-xl bg-transparent text-[#ff3b30] border border-[#ff3b30] font-bold text-sm">
  Eliminar
</button>`,
    reactNative: `import { Pressable, Text, StyleSheet } from "react-native";

<Pressable
  onPress={handleClick}
  style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
>
  <Text style={styles.label}>Confirmar</Text>
</Pressable>

const styles = StyleSheet.create({
  btn: {
    height: 45, paddingHorizontal: 10, borderRadius: 12,
    backgroundColor: "#003e70", borderWidth: 1, borderColor: "#e0e0e0",
    alignItems: "center", justifyContent: "center",
  },
  pressed: { backgroundColor: "#002c50" },
  label: { color: "#f2f2f2", fontWeight: "700", fontSize: 14, fontFamily: "Nunito" },
});`,
  },

  textfield: {
    react: `import { TextField } from "@totalcoin/ds";
import { useState } from "react";

const [value, setValue] = useState("");

<TextField
  label="Email"
  sublabel="No spam, promesa."
  placeholder="tu@email.com"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>`,
    tailwind: `<label className="flex flex-col gap-1 w-full">
  <span className="font-bold text-[18px] text-[#333]">Email</span>
  <div className="flex items-center gap-2 h-[45px] px-[10px] bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl">
    <input
      type="email"
      className="flex-1 min-w-0 bg-transparent outline-none border-none text-sm text-[#333] placeholder:text-[#828282]"
      placeholder="tu@email.com"
    />
  </div>
  <span className="font-medium text-sm text-[#4f4f4f]">No spam, promesa.</span>
</label>`,
    reactNative: `import { View, Text, TextInput, StyleSheet } from "react-native";

<View style={styles.wrap}>
  <Text style={styles.label}>Email</Text>
  <View style={styles.field}>
    <TextInput
      style={styles.input}
      placeholder="tu@email.com"
      placeholderTextColor="#828282"
      value={value}
      onChangeText={setValue}
      keyboardType="email-address"
    />
  </View>
  <Text style={styles.sublabel}>No spam, promesa.</Text>
</View>

const styles = StyleSheet.create({
  wrap: { gap: 4, width: "100%" },
  label: { fontSize: 18, fontWeight: "700", color: "#333", fontFamily: "Nunito" },
  field: { height: 45, paddingHorizontal: 10, backgroundColor: "#f9f9f9", borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 12, justifyContent: "center" },
  input: { fontSize: 14, color: "#333", fontFamily: "Nunito" },
  sublabel: { fontSize: 14, fontWeight: "500", color: "#4f4f4f", fontFamily: "Nunito" },
});`,
  },

  textarea: {
    react: `import { Textarea } from "@totalcoin/ds";

<Textarea placeholder="Escribí tu mensaje acá." />

<Textarea
  roundness="round"
  error={hasError}
  onChange={(e) => setValue(e.target.value)}
/>`,
    tailwind: `<textarea
  className={
    "block w-full min-h-[76px] px-2 py-2 " +
    "font-[Inter] text-sm leading-[21px] tracking-[0.5px] text-[#4f4f4f] " +
    "bg-[#f9f9f9] border rounded-lg shadow-sm outline-none resize " +
    "transition-colors " +
    "focus:shadow-[0_0_0_3px_#cbd5e1] " +
    (error
      ? "border-[#ff3b30] focus:shadow-[0_0_0_3px_#fca5a5]"
      : "border-[#f2f2f2] focus:border-[#828282]")
  }
  placeholder="Escribí tu mensaje acá."
/>`,
    reactNative: `import { TextInput, StyleSheet } from "react-native";

<TextInput
  style={[styles.ta, error && styles.taError]}
  multiline
  numberOfLines={4}
  placeholder="Escribí tu mensaje acá."
  placeholderTextColor="#4f4f4f"
  textAlignVertical="top"
/>

const styles = StyleSheet.create({
  ta: {
    minHeight: 76, padding: 8,
    fontFamily: "Inter", fontSize: 14, color: "#4f4f4f",
    backgroundColor: "#f9f9f9",
    borderWidth: 1, borderColor: "#f2f2f2", borderRadius: 8,
  },
  taError: { borderColor: "#ff3b30" },
});`,
  },

  alerta: {
    react: `import { Alerta } from "@totalcoin/ds";

<Alerta color="warning">
  ¡Ya podés solicitar tu tarjeta prepaga sin cargo!
</Alerta>

<Alerta color="error" rightLabel="Reintentar">
  No pudimos procesar tu pago.
</Alerta>

<Alerta color="info" showLeftIcon={false} rightIcon={<ChevronIcon />}>
  Actualizá tu app para la nueva experiencia.
</Alerta>`,
    tailwind: `<div role="alert" className="flex items-stretch w-full max-w-[361px] bg-[#fefefe] border border-[#e0e0e0] rounded-lg overflow-hidden">
  <div aria-hidden className="w-[9px] shrink-0 bg-[#f26e25]" />
  <div className="flex-1 flex items-center gap-[10px] py-[10px] px-3">
    <svg className="w-6 h-6 shrink-0 text-[#f26e25]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
    </svg>
    <span className="flex-1 min-w-0 font-[Nunito] font-medium text-sm leading-[1.3] text-[#f26e25]">
      ¡Ya podés solicitar tu tarjeta prepaga sin cargo!
    </span>
  </div>
</div>`,
    reactNative: `import { View, Text, StyleSheet } from "react-native";
import Svg, { Path, Line } from "react-native-svg";

<View style={styles.alert}>
  <View style={[styles.strip, { backgroundColor: "#f26e25" }]} />
  <View style={styles.content}>
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#f26e25" strokeWidth={2}>
      <Path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <Line x1="12" y1="9" x2="12" y2="13" />
    </Svg>
    <Text style={[styles.text, { color: "#f26e25" }]}>
      ¡Ya podés solicitar tu tarjeta prepaga sin cargo!
    </Text>
  </View>
</View>

const styles = StyleSheet.create({
  alert: { flexDirection: "row", width: "100%", maxWidth: 361, backgroundColor: "#fefefe", borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 8, overflow: "hidden" },
  strip: { width: 9 },
  content: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10, padding: 10 },
  text: { flex: 1, fontFamily: "Nunito", fontWeight: "500", fontSize: 14, lineHeight: 18 },
});`,
  },

  tooltip: {
    react: `import { Tooltip } from "@totalcoin/ds";

<Tooltip arrow="bottom" arrowAlign="center">
  Este es un tooltip simple
</Tooltip>`,
    tailwind: `<div role="tooltip" className="relative inline-block px-4 py-2 bg-[#4f4f4f] text-[#f2f2f2] text-xs font-[Nunito] rounded-lg">
  Este es un tooltip simple
  <span
    aria-hidden
    className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[7px] border-l-transparent border-r-transparent border-t-[#4f4f4f]"
  />
</div>`,
    reactNative: `import { View, Text, StyleSheet } from "react-native";

<View style={styles.tooltip}>
  <Text style={styles.text}>Este es un tooltip simple</Text>
  <View style={styles.arrow} />
</View>

const styles = StyleSheet.create({
  tooltip: { alignSelf: "flex-start", paddingHorizontal: 16, paddingVertical: 8, backgroundColor: "#4f4f4f", borderRadius: 8 },
  text: { color: "#f2f2f2", fontSize: 12, fontFamily: "Nunito" },
  arrow: { position: "absolute", top: "100%", alignSelf: "center", width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 7, borderLeftColor: "transparent", borderRightColor: "transparent", borderTopColor: "#4f4f4f" },
});`,
  },

  cardinfo: {
    react: `import { CardInfo } from "@totalcoin/ds";

{/* Data-driven */}
<CardInfo rows={[
  { label: "Razón social", value: "BETWARRIOR" },
  { label: "DNI / CUIT", value: "284556437" },
]} />

{/* Compound */}
<CardInfo>
  <CardInfo.Row label="Estado" value={<StatusPill level="low">Activo</StatusPill>} />
  <CardInfo.Row label="Saldo" value="$ 12.430" />
</CardInfo>`,
    tailwind: `<div className="flex flex-col gap-1 w-full max-w-[420px] px-3 py-2 bg-[#f9f9f9] border border-[#e0e0e0] rounded-lg shadow-sm">
  <div className="flex items-center justify-between gap-2">
    <span className="font-[Nunito] font-semibold text-base text-[#003e70]">Razón social</span>
    <span className="font-[Nunito] font-bold text-sm text-[#828282] text-right">BETWARRIOR</span>
  </div>
  <div className="flex items-center justify-between gap-2">
    <span className="font-[Nunito] font-semibold text-base text-[#003e70]">DNI / CUIT</span>
    <span className="font-[Nunito] font-bold text-sm text-[#828282] text-right">284556437</span>
  </div>
</div>`,
    reactNative: `import { View, Text, StyleSheet } from "react-native";

<View style={styles.card}>
  <View style={styles.row}>
    <Text style={styles.label}>Razón social</Text>
    <Text style={styles.value}>BETWARRIOR</Text>
  </View>
  <View style={styles.row}>
    <Text style={styles.label}>DNI / CUIT</Text>
    <Text style={styles.value}>284556437</Text>
  </View>
</View>

const styles = StyleSheet.create({
  card: { gap: 3, maxWidth: 420, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: "#f9f9f9", borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 8 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  label: { fontFamily: "Nunito", fontWeight: "600", fontSize: 16, color: "#003e70" },
  value: { fontFamily: "Nunito", fontWeight: "700", fontSize: 14, color: "#828282", textAlign: "right" },
});`,
  },

  icon: {
    react: `import { Icon } from "@totalcoin/ds";

<Icon name="check" />
<Icon name="trash" size={18} color="#ff3b30" />
<Icon name="chevron-right" size={16} />`,
    tailwind: `{/* Usa Icon o svg inline con currentColor */}
<span className="text-[#003e70]">
  <Icon name="check" size={24} />
</span>`,
    reactNative: `import Svg, { Path } from "react-native-svg";

{/* Cada icono se puede exportar como componente RN-Svg */}
<Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
  <Path d="M5 12l4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
</Svg>`,
  },

  sidebarnav: {
    react: `import { SidebarNav } from "@totalcoin/ds";

<SidebarNav
  header={<Logo />}
  sections={[
    {
      title: "Servicios",
      items: [
        { label: "Inicio", icon: "home", active: true },
        { label: "Movimientos", icon: "transfer", onClick: () => nav("/mov") },
        { label: "Transferencias", icon: "share" },
      ],
    },
  ]}
/>`,
    tailwind: `{/* Usar un container fijo + flex-col */}
<aside className="flex flex-col justify-between w-[280px] h-full px-4 pt-9 pb-3 bg-white font-[Nunito]">
  <nav className="flex flex-col gap-6">
    <div className="flex flex-col gap-3">
      <div className="font-bold text-lg text-[#828282]">Servicios</div>
      <ul>
        <li>
          <button className="flex items-center gap-[18px] w-full h-[52px] px-6 bg-[#f2f2f2] rounded-xl font-semibold">
            <Icon name="home" />
            <span>Inicio</span>
          </button>
        </li>
      </ul>
    </div>
  </nav>
</aside>`,
    reactNative: `import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";

<ScrollView style={styles.sidebar}>
  {sections.map(section => (
    <View key={section.title} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      {section.items.map(item => (
        <Pressable key={item.label} onPress={item.onPress} style={[styles.item, item.active && styles.active]}>
          <Text style={styles.itemText}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  ))}
</ScrollView>

const styles = StyleSheet.create({
  sidebar: { width: 280, backgroundColor: "#fefefe", padding: 16 },
  section: { gap: 12, marginBottom: 24 },
  sectionTitle: { fontFamily: "Nunito", fontWeight: "700", fontSize: 18, color: "#828282" },
  item: { height: 52, paddingHorizontal: 24, borderRadius: 12, justifyContent: "center" },
  active: { backgroundColor: "#f2f2f2" },
  itemText: { fontFamily: "Nunito", fontWeight: "600", fontSize: 16, color: "#333" },
});`,
  },

  datepicker: {
    react: `import { DatePicker } from "@totalcoin/ds";
import { useState } from "react";

const [date, setDate] = useState<string>("");

<DatePicker
  value={date}
  onChange={setDate}
  placeholder="Seleccioná una fecha"
  min="2024-01-01"
  max="2026-12-31"
/>`,
    tailwind: `{/* Trigger + calendar (requiere state + date math) */}
<button className="flex items-center justify-between w-[280px] h-[45px] px-[10px] bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl font-[Nunito] text-sm">
  <span>{date ? format(date) : "Seleccioná una fecha"}</span>
  <Icon name="chevron-down" />
</button>

{open && (
  <div className="absolute mt-1 p-3 bg-white border rounded-xl shadow w-[280px]">
    {/* Calendar grid omitted — usar @internationalized/date o date-fns */}
  </div>
)}`,
    reactNative: `import DateTimePicker from "@react-native-community/datetimepicker";

<Pressable onPress={() => setOpen(true)}>
  <Text>{date?.toLocaleDateString() ?? "Seleccioná una fecha"}</Text>
</Pressable>

{open && (
  <DateTimePicker
    value={date ?? new Date()}
    mode="date"
    display="spinner"
    onChange={(_, d) => { setDate(d); setOpen(false); }}
  />
)}`,
  },

  tabla: {
    react: `import { Tabla } from "@totalcoin/ds";

<Tabla
  columns={[
    { key: "id", header: "ID", width: "60px" },
    { key: "name", header: "Nombre" },
    { key: "amount", header: "Monto", align: "right" },
    { key: "status", header: "Estado", render: (row) => (
      <StatusPill level={row.status === "ok" ? "low" : "high"}>
        {row.status === "ok" ? "Activo" : "Inactivo"}
      </StatusPill>
    )},
  ]}
  data={users}
  onRowClick={(row) => navigate(\`/users/\${row.id}\`)}
/>`,
    tailwind: `<div className="w-full bg-white border border-[#e0e0e0] rounded-xl shadow-sm overflow-hidden">
  <table className="w-full border-collapse font-[Nunito] text-sm">
    <thead className="bg-[#f2f2f2]">
      <tr>
        <th className="px-3 py-3 text-left font-bold text-[13px] text-[#333] border-b border-[#e0e0e0]">ID</th>
        <th className="px-3 py-3 text-left font-bold text-[13px] text-[#333] border-b border-[#e0e0e0]">Nombre</th>
      </tr>
    </thead>
    <tbody>
      {data.map(row => (
        <tr className="hover:bg-[#f9f9f9] cursor-pointer" onClick={() => handleRow(row)}>
          <td className="px-3 py-3 border-b border-[#e0e0e0]">{row.id}</td>
          <td className="px-3 py-3 border-b border-[#e0e0e0]">{row.name}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>`,
    reactNative: `import { FlatList, View, Text, Pressable, StyleSheet } from "react-native";

<View style={styles.table}>
  <View style={[styles.row, styles.headerRow]}>
    <Text style={styles.headerCell}>ID</Text>
    <Text style={[styles.headerCell, { flex: 2 }]}>Nombre</Text>
    <Text style={styles.headerCell}>Monto</Text>
  </View>
  <FlatList
    data={data}
    keyExtractor={r => String(r.id)}
    renderItem={({ item }) => (
      <Pressable onPress={() => handleRow(item)} style={styles.row}>
        <Text style={styles.cell}>{item.id}</Text>
        <Text style={[styles.cell, { flex: 2 }]}>{item.name}</Text>
        <Text style={styles.cell}>{item.amount}</Text>
      </Pressable>
    )}
  />
</View>

const styles = StyleSheet.create({
  table: { backgroundColor: "#fefefe", borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 12 },
  row: { flexDirection: "row", paddingHorizontal: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#e0e0e0" },
  headerRow: { backgroundColor: "#f2f2f2" },
  headerCell: { flex: 1, fontFamily: "Nunito", fontWeight: "700", fontSize: 13, color: "#333" },
  cell: { flex: 1, fontFamily: "Nunito", fontSize: 14, color: "#333" },
});`,
  },

  menu: {
    react: `import { Menu } from "@totalcoin/ds";

<Menu
  trigger={<ButtonStandard>Abrir menú</ButtonStandard>}
  items={[
    { label: "Editar", value: "edit" },
    { label: "Duplicar", value: "duplicate" },
    { label: "Eliminar", value: "delete", destructive: true },
  ]}
  onSelect={(value) => console.log("Seleccionado:", value)}
/>`,
    tailwind: `{/* Trigger + popover (needs state) */}
<div className="relative inline-block">
  <button onClick={() => setOpen(!open)} className="...">Abrir</button>
  {open && (
    <div role="menu" className="absolute top-[calc(100%+4px)] left-0 z-50 min-w-[200px] bg-white border border-[#e0e0e0] rounded-xl shadow p-1">
      <button role="menuitem" className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#333] hover:bg-[#f2f2f2] rounded-lg">
        Editar
      </button>
      <button role="menuitem" className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#ff3b30] hover:bg-[#f2f2f2] rounded-lg">
        Eliminar
      </button>
    </div>
  )}
</div>`,
    reactNative: `import { Modal, Pressable, View, Text, StyleSheet } from "react-native";

<Pressable onPress={() => setOpen(true)}>
  <Text>Abrir menú</Text>
</Pressable>

<Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
  <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
    <View style={styles.panel}>
      <Pressable onPress={() => handleSelect("edit")} style={styles.item}>
        <Text style={styles.itemText}>Editar</Text>
      </Pressable>
      <Pressable onPress={() => handleSelect("delete")} style={styles.item}>
        <Text style={[styles.itemText, styles.destructive]}>Eliminar</Text>
      </Pressable>
    </View>
  </Pressable>
</Modal>

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.2)", justifyContent: "flex-start", padding: 16 },
  panel: { backgroundColor: "#fefefe", borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 12, padding: 4, minWidth: 200 },
  item: { padding: 12, borderRadius: 8 },
  itemText: { fontFamily: "Nunito", fontSize: 14, color: "#333" },
  destructive: { color: "#ff3b30" },
});`,
  },

  combobox: {
    react: `import { Combobox } from "@totalcoin/ds";
import { useState } from "react";

const [value, setValue] = useState("");

<Combobox
  value={value}
  onChange={setValue}
  placeholder="Seleccione una opción"
  searchPlaceholder="Filtrar por nombre..."
  options={[
    { value: "1", label: "Opción 1" },
    { value: "2", label: "Opción 2" },
    { value: "3", label: "Opción 3" },
  ]}
/>`,
    tailwind: `{/* Trigger */}
<button
  type="button"
  aria-haspopup="listbox"
  aria-expanded={open}
  onClick={() => setOpen(!open)}
  className="flex items-center justify-between w-full h-[45px] px-[10px] bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl font-[Nunito] text-sm text-[#828282]"
>
  <span>Seleccione una opción</span>
  <svg className={\`w-6 h-6 transition-transform \${open ? "rotate-180" : ""}\`} viewBox="0 0 24 24" fill="none" stroke="#4f4f4f" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
</button>

{/* Panel */}
{open && (
  <div role="listbox" className="absolute mt-1 left-0 right-0 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl p-[10px] max-h-60 overflow-auto">
    <label className="flex items-center gap-2 px-2 py-3 bg-[#ebeef3] border border-[#547e9f] rounded-lg">
      <svg className="w-4 h-4 text-[#828282]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input className="flex-1 bg-transparent outline-none text-sm font-[Nunito] font-medium" placeholder="Filtrar..." />
    </label>
    <ul className="mt-2">
      {options.map(o => (
        <li role="option" className="px-2 py-2 font-[Nunito] font-bold text-sm text-[#828282] hover:bg-[#f2f2f2] rounded cursor-pointer">
          {o.label}
        </li>
      ))}
    </ul>
  </div>
)}`,
    reactNative: `import { View, Text, Pressable, TextInput, FlatList, StyleSheet, Modal } from "react-native";

{/* Trigger */}
<Pressable onPress={() => setOpen(true)} style={styles.trigger}>
  <Text style={styles.placeholder}>
    {selected?.label ?? "Seleccione una opción"}
  </Text>
  <Text style={styles.chevron}>▾</Text>
</Pressable>

{/* Use Modal/BottomSheet for mobile-friendly dropdown */}
<Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
  <Pressable onPress={() => setOpen(false)} style={styles.backdrop}>
    <View style={styles.panel}>
      <View style={styles.search}>
        <TextInput
          style={styles.searchInput}
          placeholder="Filtrar..."
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={item => item.value}
        renderItem={({ item }) => (
          <Pressable onPress={() => { setSelected(item); setOpen(false); }} style={styles.item}>
            <Text style={styles.itemText}>{item.label}</Text>
          </Pressable>
        )}
      />
    </View>
  </Pressable>
</Modal>

const styles = StyleSheet.create({
  trigger: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", height: 45, paddingHorizontal: 10, backgroundColor: "#f9f9f9", borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 12 },
  placeholder: { fontFamily: "Nunito", fontSize: 14, color: "#828282", flex: 1 },
  chevron: { fontSize: 16, color: "#4f4f4f" },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", padding: 16 },
  panel: { backgroundColor: "#f9f9f9", borderRadius: 12, padding: 10, maxHeight: "70%" },
  search: { backgroundColor: "#ebeef3", borderWidth: 1, borderColor: "#547e9f", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 12 },
  searchInput: { fontFamily: "Nunito", fontSize: 14, color: "#333" },
  item: { padding: 8, borderTopWidth: 1, borderTopColor: "#e0e0e0" },
  itemText: { fontFamily: "Nunito", fontWeight: "700", fontSize: 14, color: "#828282" },
});`,
  },

  modal: {
    react: `import { Modal, ButtonStandard } from "@totalcoin/ds";
import { useState } from "react";

const [open, setOpen] = useState(false);

<ButtonStandard onClick={() => setOpen(true)}>Abrir</ButtonStandard>

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Confirmar accion"
  footer={
    <>
      <ButtonStandard variant="outline" width="full" onClick={() => setOpen(false)}>
        Cancelar
      </ButtonStandard>
      <ButtonStandard variant="primary" width="full" onClick={handleConfirm}>
        Confirmar
      </ButtonStandard>
    </>
  }
>
  Estás seguro que querés continuar?
</Modal>`,
    tailwind: `{/* Solo la visual estatica — overlay real requiere state & portal */}
<div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
  <div className="absolute inset-0 bg-black/40" />
  <div role="dialog" aria-modal className="relative w-[401px] max-w-full flex flex-col bg-[#fefefe] rounded-lg shadow overflow-hidden">
    <div className="flex items-center justify-between bg-[#f2f2f2] border-b border-[#e0e0e0] px-6 py-5">
      <h2 className="flex-1 text-center font-[Nunito] font-bold text-[22px] text-[#001944]">
        Confirmar accion
      </h2>
      <button className="w-6 h-6 text-[#4f4f4f]">×</button>
    </div>
    <div className="flex-1 p-6">Cuerpo</div>
    <div className="flex gap-4 p-6 pt-0 justify-center">
      <button className="flex-1 h-[45px] border border-[#003e70] text-[#003e70] rounded-xl">Cancelar</button>
      <button className="flex-1 h-[45px] bg-[#003e70] text-white rounded-xl">Confirmar</button>
    </div>
  </div>
</div>`,
    reactNative: `import { Modal as RNModal, View, Text, Pressable, StyleSheet } from "react-native";

<RNModal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
  <View style={styles.backdrop}>
    <View style={styles.dialog}>
      <View style={styles.header}>
        <Text style={styles.title}>Confirmar accion</Text>
        <Pressable onPress={() => setOpen(false)}>
          <Text style={styles.close}>×</Text>
        </Pressable>
      </View>
      <View style={styles.body}>
        <Text>Estás seguro que querés continuar?</Text>
      </View>
      <View style={styles.footer}>
        <Pressable onPress={() => setOpen(false)} style={styles.btnOutline}>
          <Text style={styles.btnOutlineText}>Cancelar</Text>
        </Pressable>
        <Pressable onPress={handleConfirm} style={styles.btnPrimary}>
          <Text style={styles.btnPrimaryText}>Confirmar</Text>
        </Pressable>
      </View>
    </View>
  </View>
</RNModal>

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", alignItems: "center", justifyContent: "center", padding: 16 },
  dialog: { width: 401, maxWidth: "100%", backgroundColor: "#fefefe", borderRadius: 8, overflow: "hidden" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#f2f2f2", borderBottomWidth: 1, borderBottomColor: "#e0e0e0", paddingHorizontal: 24, paddingVertical: 20 },
  title: { flex: 1, textAlign: "center", fontFamily: "Nunito", fontWeight: "700", fontSize: 22, color: "#001944" },
  close: { fontSize: 24, color: "#4f4f4f" },
  body: { padding: 24 },
  footer: { flexDirection: "row", gap: 16, paddingHorizontal: 24, paddingBottom: 24, justifyContent: "center" },
  btnOutline: { flex: 1, height: 45, borderWidth: 1, borderColor: "#003e70", borderRadius: 12, alignItems: "center", justifyContent: "center" },
  btnOutlineText: { color: "#003e70", fontFamily: "Nunito", fontWeight: "700" },
  btnPrimary: { flex: 1, height: 45, backgroundColor: "#003e70", borderRadius: 12, alignItems: "center", justifyContent: "center" },
  btnPrimaryText: { color: "#fff", fontFamily: "Nunito", fontWeight: "700" },
});`,
  },
};
