import { Request, Response } from 'express';

export const getLocation = async (req: Request, res: Response) => {
  try {
    let ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress;

    // fallback for local dev
    if (!ip || ip === '127.0.0.1' || ip === '::1') {
      ip = '8.8.8.8'; // test with public IP
    }

    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json();

    if (data.status === 'fail') {
      return res.status(500).json({ error: 'Location lookup failed', reason: data.message });
    }

    res.json({
      ip,
      city: data.city,
      region: data.regionName,
      country: data.country,
      lat: data.lat,
      lon: data.lon,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
