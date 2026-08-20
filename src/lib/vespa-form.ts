type ParsedVespa = {
  error?: string;
  data: {
    year: number | null;
    model: string;
    vin: string | null;
    color: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    story: string | null;
  };
};

const CURRENT_YEAR = new Date().getFullYear();

export function parseVespaForm(formData: FormData): ParsedVespa {
  const model = String(formData.get("model") ?? "").trim();
  const yearRaw = String(formData.get("year") ?? "").trim();
  const vin = String(formData.get("vin") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const state = String(formData.get("state") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const story = String(formData.get("story") ?? "").trim();

  const empty = {
    year: null,
    model: "",
    vin: null,
    color: null,
    city: null,
    state: null,
    country: null,
    story: null,
  };

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
      city: city || null,
      state: state || null,
      country: country || null,
      story: story || null,
    },
  };
}
