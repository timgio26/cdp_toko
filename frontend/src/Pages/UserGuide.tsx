import { useState } from "react";

/* =========================
 * Types
 * ========================= */

type SectionId = "csm" | "inventory" | "sales";

type GuideStep = {
  title: string;
  description: string;
};

type GuideSection = {
  title: string;
  description: string;
  steps: GuideStep[];
};

type NavigationSection = {
  id: SectionId;
  label: string;
};

type GuideHeaderProps = {
  title: string;
  description: string;
  image: string;
};

type GuideStepsProps = {
  steps: GuideStep[];
};

type KeyFeaturesProps = {
  items: string[];
};

/* =========================
 * Content
 * ========================= */

const csmContent: GuideSection[] = [
  {
    title: "1. Mengelola Customer",
    description:
      "Customer dapat ditambahkan, diubah, dan dihapus melalui halaman Customer.",

    steps: [
      {
        title: "Menambah Customer",
        description:
          "Klik tombol biru di pojok kanan bawah untuk menambahkan customer baru. Masukkan data customer seperti nama, alamat, dan nomor telepon. Pastikan seluruh data yang dimasukkan sudah benar.",
      },
      {
        title: "Mengubah Customer",
        description:
          "Untuk mengubah data customer, klik ikon pensil pada baris customer yang ingin diubah. Perbarui data yang diperlukan, kemudian simpan perubahan.",
      },
      {
        title: "Menghapus Customer",
        description:
          "Untuk menghapus customer, klik ikon tempat sampah pada baris customer yang ingin dihapus, kemudian konfirmasi penghapusan.",
      },
    ],
  },

  {
    title: "2. Mengelola Alamat",
    description:
      "Setiap customer dapat memiliki lebih dari satu alamat. Alamat dapat digunakan untuk mencatat lokasi properti atau tempat service customer.",

    steps: [
      {
        title: "Menambah Alamat",
        description:
          "Klik customer yang ingin ditambahkan alamatnya, kemudian klik tombol biru di pojok kanan bawah.",
      },
      {
        title: "Mengisi Data Alamat",
        description:
          "Masukkan informasi alamat dengan lengkap, termasuk alamat, nomor telepon, dan nama orang yang bertanggung jawab atas alamat tersebut.",
      },
      {
        title: "Menggunakan Pinpoint",
        description:
          "Manfaatkan fitur pinpoint untuk menentukan lokasi alamat dengan lebih akurat. Pinpoint akan membantu mempermudah pencarian lokasi tersebut di kemudian hari.",
      },
      {
        title: "Menentukan Kategori Properti",
        description:
          "Pilih kategori properti yang sesuai, misalnya Rumah, Pabrik, Restoran, atau kategori lain yang tersedia.",
      },
      {
        title: "Mengubah atau Menghapus Alamat",
        description:
          "Data alamat dapat diubah atau dihapus dengan cara yang sama seperti pengelolaan data customer.",
      },
    ],
  },

  {
    title: "3. Mengelola Service",
    description:
      "Setiap alamat memiliki riwayat service masing-masing. Riwayat ini digunakan untuk mencatat service yang pernah dilakukan pada alamat tersebut.",

    steps: [
      {
        title: "Melihat Service History",
        description:
          "Klik alamat yang ingin dilihat untuk membuka detail alamat dan melihat riwayat service yang terkait dengan alamat tersebut.",
      },
      {
        title: "Menambah Service",
        description:
          "Klik tombol biru di pojok kanan bawah untuk menambahkan service baru. Masukkan seluruh data service dengan lengkap dan benar.",
      },
      {
        title: "Mengubah Service",
        description:
          "Untuk mengubah data service, pilih service yang ingin diperbarui kemudian klik ikon pensil. Perbarui informasi yang diperlukan dan simpan perubahan.",
      },
      {
        title: "Menghapus Service",
        description:
          "Untuk menghapus data service, klik ikon tempat sampah pada service yang ingin dihapus, kemudian konfirmasi penghapusan.",
      },
    ],
  },
];



/* =========================
 * Navigation
 * ========================= */

const sections: NavigationSection[] = [
  {
    id: "csm",
    label: "CSM",
  },
  {
    id: "inventory",
    label: "Inventory Management",
  },
  {
    id: "sales",
    label: "Sales Management",
  },
];

/* =========================
 * Inventory Content
 * ========================= */

const inventoryContent: GuideSection[] = [
  {
    title: "Preliminary: Kategori Produk dan Supplier",
    description:
      "Sebelum mengelola produk, disarankan untuk menambahkan kategori produk dan supplier terlebih dahulu. Hal ini akan mempermudah pengelolaan produk di kemudian hari.",

    steps: [
      {
        title: "Mengelola Kategori Produk",
        description:
          "Buka dropdown Inventory pada bar navigasi di bagian atas, kemudian pilih Category. Pada halaman Category, masukkan kategori produk yang diperlukan. Kategori dapat ditambahkan, diubah, dan dihapus sesuai kebutuhan.",
      },
      {
        title: "Mengelola Supplier",
        description:
          "Buka dropdown Inventory pada bar navigasi di bagian atas, kemudian pilih Supplier. Pada halaman Supplier, masukkan data supplier yang diperlukan. Supplier dapat ditambahkan, diubah, dan dihapus sesuai kebutuhan.",
      },
    ],
  },

  {
    title: "1. Mengelola Produk",
    description:
      "Produk digunakan sebagai data utama untuk transaksi penjualan dan pencatatan pergerakan stok. Pastikan data produk dimasukkan dengan lengkap dan benar.",

    steps: [
      {
        title: "Menambah Produk",
        description:
          "Klik tombol hitam di pojok kanan atas untuk menambahkan produk baru.",
      },
      {
        title: "Mengisi Data Produk",
        description:
          "Masukkan nama produk, SKU untuk mempermudah pencarian, kategori produk, satuan seperti pcs, kg, dan sebagainya, harga beli per unit, harga jual per unit, serta supplier produk.",
      },
      {
        title: "Mengubah Produk",
        description:
          "Untuk mengubah data produk, klik ikon pensil pada baris produk yang ingin diubah. Perbarui data yang diperlukan, kemudian simpan perubahan.",
      },
      {
        title: "Menghapus Produk",
        description:
          "Untuk menghapus produk, klik ikon tempat sampah pada baris produk yang ingin dihapus, kemudian konfirmasi penghapusan.",
      },
    ],
  },

  {
    title: "2. Mengelola Stock Movement",
    description:
      "Stock Movement atau pergerakan stok digunakan untuk mencatat riwayat barang masuk dan barang keluar. Pergerakan stok dapat dicatat secara manual maupun dibuat secara otomatis berdasarkan transaksi sales atau invoice.",

    steps: [
      {
        title: "Membuka Stock Movement",
        description:
          "Buka dropdown Inventory pada bar navigasi di bagian atas, kemudian pilih Stock Movement.",
      },
      {
        title: "Menambah Stock Movement",
        description:
          "Klik tombol hitam di pojok kanan atas untuk mencatat pergerakan stok baru.",
      },
      {
        title: "Memilih Produk",
        description:
          "Pilih produk yang mengalami pergerakan stok.",
      },
      {
        title: "Menentukan Jenis Pergerakan",
        description:
          "Pilih jenis pergerakan stok, yaitu Inbound untuk stok masuk atau Outbound untuk stok keluar.",
      },
      {
        title: "Mengisi Detail Stock Movement",
        description:
          "Masukkan jumlah stok, tanggal pergerakan, serta alasan atau sumber pergerakan stok, misalnya Inbound, Stock Adjustment, atau alasan lainnya.",
      },
      {
        title: "Mengubah atau Menghapus Stock Movement",
        description:
          "Stock Movement yang dapat diubah atau dihapus hanya merupakan Stock Movement terakhir untuk setiap produk. Stock Movement yang berasal dari invoice tidak dapat diubah atau dihapus.",
      },
    ],
  },
];

/* =========================
 * Sales Content
 * ========================= */

const salesContent: GuideSection[] = [
  {
    title: "1. Membuat Sales",
    description:
      "Gunakan fitur Create Invoice untuk mencatat penjualan produk maupun jasa yang tersedia di Inventory Management.",

    steps: [
      {
        title: "Create Invoice",
        description:
          'Klik tombol biru "Create Invoice" di pojok kanan atas halaman untuk membuat transaksi penjualan baru.',
      },
      {
        title: "Mengisi Data Customer",
        description:
          "Masukkan customer melalui pencarian atau isi data customer secara manual. Jika customer tidak diisi, transaksi akan otomatis menggunakan Walk-in Customer.",
      },
      {
        title: "Memilih Produk",
        description:
          "Pada bagian Products, pilih produk yang dibeli oleh customer.",
      },
      {
        title: "Jumlah dan Diskon Produk",
        description:
          "Masukkan jumlah produk yang dibeli. Jika terdapat diskon untuk produk tertentu, masukkan diskon pada produk tersebut.",
      },
      {
        title: "Discount & Fees",
        description:
          "Masukkan diskon terhadap total transaksi serta biaya tambahan lainnya jika ada.",
      },
      {
        title: "Metode Pembayaran",
        description:
          "Pilih metode pembayaran yang digunakan oleh customer.",
      },
      {
        title: "Review Transaksi",
        description:
          "Periksa kembali customer, produk, jumlah, diskon, biaya tambahan, total pembayaran, dan metode pembayaran.",
      },
      {
        title: "Complete Sales",
        description:
          'Jika seluruh data sudah benar, klik tombol biru "Complete Sales". Setelah transaksi selesai, sistem akan mengarahkan ke halaman invoice yang dapat dicetak.',
      },
    ],
  },

  {
    title: "2. Sales History & Cancel Sales",
    description:
      "Sales History digunakan untuk melihat transaksi yang telah tercatat serta melakukan pembatalan transaksi jika diperlukan.",

    steps: [
      {
        title: "Melihat Sales History",
        description:
          "Buka dropdown Sales pada bar navigasi di bagian atas, kemudian pilih Sales History untuk melihat riwayat transaksi penjualan.",
      },
      {
        title: "Melihat Invoice",
        description:
          "Pilih transaksi yang ingin dilihat untuk membuka invoice. Invoice dapat dicetak sesuai kebutuhan.",
      },
      {
        title: "Cancel Sales",
        description:
          "Sales yang sudah selesai tidak dapat diedit. Jika transaksi perlu dibatalkan, klik ikon tempat sampah pada transaksi tersebut.",
      },
      {
        title: "Pengembalian Stock",
        description:
          "Setelah sales dibatalkan, stok produk yang digunakan dalam transaksi akan otomatis dikembalikan ke inventory.",
      },
      {
        title: "Status Cancelled Sale",
        description:
          "Transaksi yang dibatalkan tidak dihapus dari history. Transaksi akan tetap tercatat dengan status Cancelled Sale sebagai bagian dari riwayat transaksi.",
      },
    ],
  },
];

/* =========================
 * Content Resolver
 * ========================= */

const guideContent: Record<SectionId, GuideSection[]> = {
  csm: csmContent,
  inventory: inventoryContent,
  sales: salesContent,
};

/* =========================
 * Component
 * ========================= */

export default function UserGuide() {
  const [activeSection, setActiveSection] =
    useState<SectionId>("csm");

  const activeContent = guideContent[activeSection];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          User Guide
        </h1>

        <p className="mt-2 text-gray-500">
          Panduan penggunaan fitur utama sistem.
        </p>
      </div>

      {/* Navigation */}
      <div className="mb-8 flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {sections.map((section) => {
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {section.label}
            </button>
          );
        })}
      </div>

      {/* Active Content */}
      <div className="space-y-10">
        {/* CSM Header */}
        <GuideHeader
          title={
            activeSection === "csm"
              ? "Customer Service Management"
              : sections.find(
                  (section) => section.id === activeSection
                )?.label ?? ""
          }
          description={
            activeSection === "csm"
              ? "CSM digunakan untuk mengelola data customer, alamat customer, dan riwayat service yang dilakukan."
              : "Panduan penggunaan modul."
          }
          image={`/images/user-guide/${activeSection}.png`}
        />

        {/* Guide Sections */}
        {activeContent.map((section, sectionIndex) => (
          <section key={section.title}>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              {section.title}
            </h2>

            <p className="mb-6 text-gray-500">
              {section.description}
            </p>

            <GuideSteps steps={section.steps} />

            {/* Key features only for the last section */}
            {sectionIndex === activeContent.length - 1 && (
              <KeyFeatures
                items={section.steps.map(
                  (step) => step.title
                )}
              />
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

/* =========================
 * Guide Header
 * ========================= */

function GuideHeader({
  title,
  description,
  image,
}: GuideHeaderProps) {
  return (
    <div className="mb-10 grid items-center gap-8 md:grid-cols-2">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          {title}
        </h2>

        <p className="mt-3 leading-relaxed text-gray-500">
          {description}
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
        <img
          src={image}
          alt={`${title} screenshot`}
          className="max-h-64 w-full rounded-lg object-contain"
        />
      </div>
    </div>
  );
}

/* =========================
 * Guide Steps
 * ========================= */

function GuideSteps({ steps }: GuideStepsProps) {
  return (
    <div className="mb-8">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Cara Penggunaan
      </h3>

      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="flex gap-3"
          >
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
              {index + 1}
            </span>

            <div>
              <h4 className="font-medium text-gray-800">
                {step.title}
              </h4>

              <p className="mt-1 leading-relaxed text-gray-500">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* =========================
 * Key Features
 * ========================= */

function KeyFeatures({
  items,
}: KeyFeaturesProps) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Fitur Utama
      </h3>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-lg border border-gray-200 p-4 text-sm text-gray-600"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}