const express = require('express');
const router = express.Router();
const SafeZone = require('../src/models/SafeZone');

// Tüm güvenli bölgeleri getir
router.get('/safe-zones', async (req, res) => {
  try {
    const safeZones = await SafeZone.find();
    res.json(safeZones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Şehre göre güvenli bölgeleri getir
router.get('/safe-zones/city/:cityName', async (req, res) => {
  try {
    const safeZones = await SafeZone.find({ city: req.params.cityName });
    res.json(safeZones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// İlçeye göre güvenli bölgeleri getir
router.get('/safe-zones/district/:districtName', async (req, res) => {
  try {
    const safeZones = await SafeZone.find({ district: req.params.districtName });
    res.json(safeZones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 