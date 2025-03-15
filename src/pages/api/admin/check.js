// pages/api/admin/check.js
import { verifyToken } from '@/utils/jsonwebtoken';

export default function handler(req, res) {
  verifyToken(req, res, () => {
    res.status(200).json({ admin: req.user });
  });
}
