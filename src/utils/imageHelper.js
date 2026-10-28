export const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

/**
 * Kompresi gambar browser-side menggunakan HTML5 Canvas
 * Menyesuaikan dimensi maksimum (max 1024px) & kualitas JPEG 0.75
 * Hasil ukuran Base64 sangat ramping (~50KB - 120KB) sehingga:
 * 1. 100% Aman disimpan langsung di Cloud Firestore dokumen (Batas 1MB)
 * 2. Menghemat bandwidth & mempercepat inferensi Groq Vision AI (<1 detik)
 */
export const compressImageToBase64 = (file, maxWidth = 1024, quality = 0.75) => {
    return new Promise((resolve, reject) => {
        if (!file || !file.type.startsWith('image/')) {
            reject(new Error("File yang dipilih bukan gambar yang valid"));
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxWidth) {
                    if (width > height) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    } else {
                        width = Math.round((width * maxWidth) / height);
                        height = maxWidth;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Format JPEG terkompresi
                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedBase64);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};