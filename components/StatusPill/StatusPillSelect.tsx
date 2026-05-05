import { useState, type CSSProperties } from "react";
import { StatusPill, type Criticality } from "./StatusPill.tsx";
import { Menu } from "../Menu/Menu.tsx";
import { Icon } from "../Icon/Icon.tsx";

export interface StatusPillSelectOption {
  value: Criticality;
  label: string;
}

export interface StatusPillSelectProps {
  /** Valor actual seleccionado. */
  value: Criticality;
  /** Opciones disponibles. */
  options: StatusPillSelectOption[];
  /** Callback al seleccionar una opción. */
  onChange: (value: Criticality) => void;
  className?: string;
  style?: CSSProperties;
}

/**
 * Selector de criticidad basado en StatusPill.
 *
 * Renderiza un StatusPill con chevron-down que abre un Menu al hacer click.
 * Las opciones del menú muestran un dot de color correspondiente a cada criticidad.
 */
export function StatusPillSelect({
  value,
  options,
  onChange,
  className,
  style,
}: StatusPillSelectProps): JSX.Element {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((o) => o.value === value);
  const label = selectedOption?.label ?? value;

  const menuItems = options.map((option) => ({
    value: option.value,
    label: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <ColorDot level={option.value} />
        {option.label}
      </span>
    ),
  }));

  function handleSelect(selectedValue: string | undefined) {
    if (selectedValue && selectedValue !== value) {
      onChange(selectedValue as Criticality);
    }
    setOpen(false);
  }

  return (
    <Menu
      trigger={
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            cursor: "pointer",
            ...style,
          }}
          className={className}
        >
          <StatusPill
            level={value}
            icon={
              <span
                style={{
                  display: "inline-flex",
                  transition: "transform 200ms ease",
                  transform: open ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <Icon name="chevron-down" size={16} />
              </span>
            }
          >
            {label}
          </StatusPill>
        </span>
      }
      items={menuItems}
      onSelect={handleSelect}
      align="start"
      minWidth={160}
    />
  );
}

/** Dot de color circular para cada opción del menú. */
function ColorDot({ level }: { level: Criticality }): JSX.Element {
  const colors: Record<Criticality, string> = {
    low: "#00974e",
    medium: "#ff9500",
    high: "#ff3a30",
    neutral: "#005ebc",
  };

  return (
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: 9999,
        backgroundColor: colors[level],
        flexShrink: 0,
      }}
    />
  );
}
