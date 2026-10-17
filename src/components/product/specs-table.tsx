import type { ProductSpecs } from "@/lib/commerce/types";

interface SpecsTableProps {
  specs: ProductSpecs;
}

export function SpecsTable({ specs }: SpecsTableProps) {
  // Formatters
  function formatDimensions(dim?: ProductSpecs["dimensions"]): string | undefined {
    if (!dim) return undefined;
    const parts = [dim.length, dim.width, dim.height].filter(
      (v) => v !== undefined && v !== null
    );
    if (parts.length === 0) return undefined;
    return `${parts.join(" × ")} ${dim.unit || "in"}`;
  }

  // 1. Electrical
  const electricalRows = [
    specs.wattage ? { label: "Wattage", value: specs.wattage } : null,
    specs.voltage ? { label: "Voltage", value: specs.voltage } : null,
    specs.dimmable !== undefined
      ? { label: "Dimmable", value: specs.dimmable ? "Yes" : "No" }
      : null,
    specs.dimmingType && specs.dimmingType.length > 0
      ? { label: "Dimming Type", value: specs.dimmingType.join(", ") }
      : null,
    specs.operatingTemp
      ? { label: "Operating Temperature", value: specs.operatingTemp }
      : null,
  ].filter(Boolean) as { label: string; value: string }[];

  // 2. Photometric
  const photometricRows = [
    specs.lumens !== undefined
      ? { label: "Lumens", value: `${specs.lumens.toLocaleString()} lm` }
      : null,
    specs.lumensPerWatt !== undefined
      ? { label: "Efficacy", value: `${specs.lumensPerWatt} lm/W` }
      : null,
    specs.cct ? { label: "Color Temp", value: specs.cct } : null,
    specs.cri !== undefined ? { label: "CRI", value: `${specs.cri}+` } : null,
    specs.beamAngle ? { label: "Beam Angle", value: specs.beamAngle } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  // 3. Physical
  const dimFormatted = formatDimensions(specs.dimensions);
  const physicalRows = [
    dimFormatted ? { label: "Dimensions", value: dimFormatted } : null,
    specs.weight !== undefined
      ? { label: "Weight", value: `${specs.weight} lbs` }
      : null,
    specs.material ? { label: "Material", value: specs.material } : null,
    specs.finish ? { label: "Finish", value: specs.finish } : null,
    specs.ipRating ? { label: "IP Rating", value: specs.ipRating } : null,
    specs.locationRating
      ? {
          label: "Location Rating",
          value:
            specs.locationRating.charAt(0).toUpperCase() +
            specs.locationRating.slice(1),
        }
      : null,
  ].filter(Boolean) as { label: string; value: string }[];

  // 4. Compliance
  const complianceRows = [
    specs.certifications && specs.certifications.length > 0
      ? { label: "Certifications", value: specs.certifications.join(" · ") }
      : null,
    specs.lifespan !== undefined
      ? {
          label: "Lifespan",
          value: `${specs.lifespan.toLocaleString()} hours`,
        }
      : null,
    specs.warrantyYears !== undefined
      ? {
          label: "Warranty",
          value: `${specs.warrantyYears}-year warranty`,
        }
      : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const groups = [
    { name: "Electrical", rows: electricalRows },
    { name: "Photometric", rows: photometricRows },
    { name: "Physical", rows: physicalRows },
    { name: "Compliance", rows: complianceRows },
  ].filter((g) => g.rows.length > 0);

  if (groups.length === 0) {
    return <p className="text-sm text-muted-foreground">No technical specifications available.</p>;
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.name} className="space-y-3">
          <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground border-b pb-2">
            {group.name}
          </h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {group.rows.map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between py-1.5 border-b border-border/40"
              >
                <dt className="text-muted-foreground font-normal">{row.label}</dt>
                <dd className="font-medium text-foreground text-right pl-4">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
