import { MercadoPagoConfig, Preference } from "mercadopago";
import express from "express";
import { onRequest } from "firebase-functions/https";

const client = new MercadoPagoConfig({ accessToken: "" });
const app = express();
app.use(express.json());

app.post("/", async (_req, res) => {
  try {
    const body = {
      items: [
        {
          id: "1",
          title: "Donation",
          quantity: 1,
          unit_price: 5,
          currency_id: "USD",
        },
      ],
      auto_return: "approved",
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });
    res.json({ id: result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating the preference" });
  }
});

export const api = onRequest(app);
