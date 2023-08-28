const express = require("express");
const router = express.Router();
const axios = require("axios"); //library for http req
//return the rate of dollar.
//{
//  "rate": 3.75162
//}
router.get("/exchange-rate", async (req, res) => {
  try {
    // Retrieve the API key for Open Exchange Rates from environment variables
    const apiKey = process.env.OPENEXCHANGERATES_API_KEY;
    // Define the base currency as USD (US Dollar) and target currency as ILS (Israeli Shekel)
    const baseCurrency = "USD";
    const targetCurrency = "ILS";
    // Construct the API URL for retrieving the latest exchange rates
    const apiUrl = `https://openexchangerates.org/api/latest.json?app_id=${apiKey}&base=${baseCurrency}`;
    // Send a GET request to the Open Exchange Rates API using Axios
    const response = await axios.get(apiUrl);
    const exchangeRates = response.data.rates;
    // Retrieve the exchange rate from USD to ILS
    const usdToIlsRate = exchangeRates[targetCurrency];

    res.status(200).json({ rate: usdToIlsRate });
  } catch (error) {
    res.status(500).json({ message: "Error fetching exchange rate" });
  }
});

module.exports = router;
