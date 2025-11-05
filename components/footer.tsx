"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface SettingsData {
  alamat?: string;
  telp?: string;
  email?: string;
  kecamatan?: string;
  kabupaten?: string;
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState<SettingsData>({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/public/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const displayAddress =
    settings.alamat || "Jl. Sendangan, Kec. Kawangkoan, Kab. Minahasa";
  const displayEmail = settings.email || "kelurahansendangan@contoh.go.id";
  const displayTelp = settings.telp || "0812-xxxx-xxxx";

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg text-slate-900 mb-4">
              <Image
                src="/minahasa.png" // atau "/uploads/logo-minahasa.png"
                alt="Logo Kabupaten Minahasa"
                width={50}
                height={50}
              />
              <span>Kelurahan Sendangan</span>
            </div>
            <p className="text-slate-600 text-sm">{displayAddress}</p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Kontak</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <p>Email: {displayEmail}</p>
              <p>Telepon/WA: {displayTelp}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Tautan Cepat</h3>
            <nav className="space-y-2 text-sm">
              <Link
                href="/"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                Beranda
              </Link>
              <br />
              <Link
                href="/profil"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                Profil
              </Link>
              <br />
              <Link
                href="/berita"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                Berita
              </Link>
              <br />
              <Link
                href="/galeri"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                Galeri
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 text-center text-sm text-slate-600">
          <p>© {currentYear} Kelurahan Sendangan. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
