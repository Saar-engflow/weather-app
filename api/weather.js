// /api/weather.js

export default async function handler(req, res) {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  const API_KEY = process.env.API_KEY; // Your secret key

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: 'City not found' });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}
