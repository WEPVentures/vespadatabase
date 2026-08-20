type ParsedVespa = {
  error?: string;
  data: {
    year: number | null;
    model: string;
    vin: string | null;
    color: string | null;
    story: string | null;
  };
};

const CURRENT_YEAR = new Date().getFullYear();

export function parseVespaForm(formData: FormData): ParsedVespa {
  const model = String(formData.get("model") ?? "").trim();
  const yearRaw = String(formData.get("year") ?? "").trim();
  const vin = String(formData.get("vin") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim();
  const story = String(formData.get("story") ?? "").trim();

  const empty = { year: null, model: "", vin: null, color: null, story: null };

  if (!model) {
    return { error: "Model is required.", data: empty };
  }

  let year: number | null = null;
  if (yearRaw) {
    const parsedYear = Number(yearRaw);
    if (!Number.isInteger(parsedYear) || parsedYear < 1946 || parsedYear > CURRENT_YEAR + 1) {
      return { error: "Enter a valid year.", data: empty };
    }
    year = parsedYear;
  }

  return {
    data: {
      year,
      model,
      vin: vin || null,
      color: color || null,
      story: story || null,
    },
  };
}
