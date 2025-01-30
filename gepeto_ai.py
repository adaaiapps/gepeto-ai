import os
from ai_utils import analyze_repo, generate_pinokio_scripts

def main():
    repo_url = input("Masukkan URL repositori GitHub: ")
    try:
        repo_data = analyze_repo(repo_url)
        if repo_data:
            try:
                # Generate Pinokio scripts
                pinokio_scripts = generate_pinokio_scripts(repo_data)
                print("Skrip Pinokio berhasil dibuat:")

                # Tentukan lokasi Pinokio Home
                pinokio_home = os.environ.get("PINOKIO_HOME", "/PINOKIO_HOME")
                app_name = "generated_app"
                app_folder = os.path.join(pinokio_home, "api", app_name)

                # Buat folder aplikasi
                os.makedirs(app_folder, exist_ok=True)

                # Simpan setiap file hasil di folder aplikasi
                for filename, content in pinokio_scripts.items():
                    print(f"\n{filename}:\n{content}")
                    with open(os.path.join(app_folder, filename), "w") as f:
                        f.write(content)

                print(f"\nSkrip Pinokio disimpan di folder: {app_folder}")

                # Periksa keberadaan pinokio.js
                if "pinokio.js" not in pinokio_scripts:
                    print("\nPerhatian: Tidak ada file pinokio.js yang dihasilkan. Menambahkan file pinokio.js default...")
                    default_pinokio_js = """
module.exports = {
  "run": [{
    "method": "script.start",
    "params": {
      "uri": "start.js"
    }
  }]
}
"""
                    with open(os.path.join(app_folder, "pinokio.js"), "w") as f:
                        f.write(default_pinokio_js)
                    print("File pinokio.js default telah ditambahkan.")

            except Exception as e:
                print(f"Terjadi kesalahan saat membuat skrip Pinokio: {e}")
        else:
            print("Gagal menganalisis repositori.")
    except Exception as e:
        print(f"Terjadi kesalahan: {e}")

if __name__ == "__main__":
    main()
