import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Auto-hydrate full 7,600-line src/App.jsx and public/shrexora-logo.jpg from OPEN_IN_BROWSER_DIRECTLY.html
try {
  const htmlPath = path.resolve('OPEN_IN_BROWSER_DIRECTLY.html');
  const appPath = path.resolve('src/App.jsx');
  if (fs.existsSync(htmlPath)) {
    const existingApp = fs.existsSync(appPath) ? fs.readFileSync(appPath, 'utf8') : '';
    if (existingApp.length < 50000) {
      const html = fs.readFileSync(htmlPath, 'utf8');
      const lines = html.split(/\r?\n/);
      const logoLine = lines.find(l => l.includes('window.LOGO_SRC =')).replace('window.LOGO_SRC =', 'const LOGO_SRC =').trim();
      const sampleStart = lines.findIndex(l => l.includes('window.SAMPLE_IMAGES = {'));
      const sampleEnd = lines.findIndex((l, idx) => idx > sampleStart && l.trim() === '};');
      const sampleBlock = ['const SAMPLE_IMAGES = {', ...lines.slice(sampleStart + 1, sampleEnd + 1)].join('\n');
      const bodyStart = lines.findIndex(l => l.includes('const SERVICES_DATA ='));
      const bodyEnd = lines.findIndex(l => l.includes('const root = ReactDOM.createRoot'));
      const bodyLines = lines.slice(bodyStart, bodyEnd).map(l =>
        l === 'function ShrexoraTechnologiesApp() {' ? 'export default function ShrexoraTechnologiesApp() {' : l
      );
      const header = `import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Globe, Smartphone, TrendingUp, Palette, Cloud, Bot, ArrowRight, ArrowLeft,
  CheckCircle2, Sparkles, ShieldCheck, Zap, Users, Layers, Code2, Cpu,
  MessageSquare, Send, Phone, Mail, MapPin, Clock, ChevronRight, ChevronDown,
  Star, Award, Terminal, Rocket, Calculator, Search, Filter, ExternalLink,
  Menu, X, Check, RefreshCw, HelpCircle, Briefcase, Building2, ShoppingBag,
  GraduationCap, HeartHandshake, Eye, Lock, Server, BarChart3, Play, Pause,
  Box, PackageCheck, Compass, Move3d, RotateCw, Camera, Wifi, BatteryCharging
} from 'lucide-react';`;
      const fullApp = [header, logoLine, '', sampleBlock, '', ...bodyLines].join('\n');
      fs.writeFileSync(appPath, fullApp, 'utf8');
      fs.writeFileSync(path.resolve('src/shrexora_technologies_app.jsx'), fullApp, 'utf8');
      const b64Match = logoLine.match(/base64,([^"]+)/);
      if (b64Match) {
        fs.mkdirSync(path.resolve('public'), { recursive: true });
        fs.writeFileSync(path.resolve('public/shrexora-logo.jpg'), Buffer.from(b64Match[1], 'base64'));
      }
    }
  }
} catch (err) {
  console.warn('Auto-sync skipped:', err);
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
});
