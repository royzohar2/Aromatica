const express = require("express");
const router = express.Router();
const axios = require("axios");
//return the rate of dollar.
//{
//  "rate": 3.75162
//}
router.get("/exchange-rate", async (req, res) => {
  try {
    const apiKey = process.env.OPENEXCHANGERATES_API_KEY;
    const baseCurrency = "USD";
    const targetCurrency = "ILS";

    const apiUrl = `https://openexchangerates.org/api/latest.json?app_id=${apiKey}&base=${baseCurrency}`;

    const response = await axios.get(apiUrl);
    const exchangeRates = response.data.rates;
    const usdToIlsRate = exchangeRates[targetCurrency];

    res.status(200).json({ rate: usdToIlsRate });
  } catch (error) {
    res.status(500).json({ message: "Error fetching exchange rate" });
  }
});

module.exports = router;
