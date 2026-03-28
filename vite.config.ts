import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

export default defineConfig({
	plugins: [react(), tailwindcss()],
	// Cấu hình base URL chính xác theo tên repository
	// Điều này sửa lỗi 404 khi tải assets nếu URL không có dấu gạch chéo cuối
	base: '/daybinh/',
	build: {
		outDir: 'dist',
		assetsDir: 'assets',
	}
});