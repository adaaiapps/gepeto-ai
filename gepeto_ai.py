import os
import json
import subprocess
from ai_utils import analyze_repo, generate_pinokio_scripts

def main():
    repo_url = input("Masukkan URL repositori GitHub: ")
    try:
        repo_data = analyze_repo(repo_url)
        if repo_data:
            try:
                pinokio_scripts = generate_pinokio_scripts(repo_data)
                print("Skrip Pinokio berhasil dibuat:")
                for filename, content in pinokio_scripts.items():
                    print(f"\n{filename}:\n{content}")
                    with open(f"output/{filename}", "w") as f:
                        f.write(content)
                print("\nSkrip Pinokio disimpan di folder output")
            except Exception as e:
                print(f"Terjadi kesalahan saat membuat skrip Pinokio: {e}")
        else:
            print("Gagal menganalisis repositori.")
    except Exception as e:
        print(f"Terjadi kesalahan: {e}")

if __name__ == "__main__":
    main()
