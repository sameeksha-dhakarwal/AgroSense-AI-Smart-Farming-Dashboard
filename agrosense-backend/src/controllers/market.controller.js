export const getMarketForecast = (req, res) => {
  const { crop } = req.body;

  const basePrices = {
    rice: 2200,
    wheat: 2400,
    maize: 1800,
    cotton: 6500,
  };

  const base = basePrices[crop.toLowerCase()] || 2000;

  // Generate 7-day forecast
  const forecast = Array.from({ length: 7 }).map((_, i) => ({
    day: `Day ${i + 1}`,
    price: Math.round(base + (Math.random() * 200 - 100)),
  }));

  const trend =
    forecast[6].price > forecast[0].price
      ? "Upward"
      : forecast[6].price < forecast[0].price
      ? "Downward"
      : "Stable";

  res.json({
    crop,
    currentPrice: base,
    trend,
    forecast,
    insight:
      trend === "Upward"
        ? "Prices are expected to rise. Consider holding stock."
        : trend === "Downward"
        ? "Prices may fall. Consider selling early."
        : "Prices are stable.",
  });
};
