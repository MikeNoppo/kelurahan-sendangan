import Image from "next/image"

export default function GaleriPage() {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&h=500&fit=crop",
      caption: "Kegiatan warga",
    },
    {
      src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop",
      caption: "UMKM lokal",
    },
    {
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop",
      caption: "Pemandangan Sendangan",
    },
    {
      src: "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=500&h=500&fit=crop",
      caption: "Kegiatan komunitas",
    },
    {
      src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop",
      caption: "Produk lokal",
    },
    {
      src: "https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=500&h=500&fit=crop",
      caption: "Acara kelurahan",
    },
  ]

  return (
    <div className="w-full">
      <section className="relative bg-slate-900 text-white py-12 px-4">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2074"
            alt="Galeri Kegiatan"
            fill
            className="object-cover opacity-10"
            sizes="100vw"
          />
        </div>
        <div className="mx-auto max-w-7xl relative z-10">
          <h1 className="text-4xl font-bold">Galeri Kegiatan</h1>
          <p className="text-slate-300 mt-2">Dokumentasi kegiatan dan potensi Kelurahan Sendangan</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <div key={index} className="group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="relative w-full h-64 bg-slate-200">
                  <Image
                    src={image.src}
                    alt={image.caption}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="bg-slate-50 p-4">
                  <p className="text-slate-700 font-medium text-center">{image.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
