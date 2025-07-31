// This file ensures the api directory is included in Vercel deployment
export default function handler(req, res) {
  res.status(200).json({ message: 'API placeholder' });
}