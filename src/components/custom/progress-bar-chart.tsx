function formatNumber(num: number, unitFormat?: string) {
  if (typeof num !== "number") return "-";

  if (unitFormat === "abbreviated") {
    if (num >= 1000000) {
      const result = num / 1000000;
      return result % 1 === 0 ? `${result}M` : `${result.toFixed(1)}M`;
    }
    if (num >= 1000) {
      const result = num / 1000;
      return result % 1 === 0 ? `${result}K` : `${result.toFixed(1)}K`;
    }
  }

  return new Intl.NumberFormat("en-US").format(num);
}