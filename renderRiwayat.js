function renderRiwayat() {
    const container = document.getElementById('historyList');
    if (!container) return;
    
    container.innerHTML = "";
    
    if (transactionHistory.length === 0) {
        container.innerHTML = `<p class="text-center text-xs text-slate-400 py-6">Belum ada riwayat transaksi.</p>`;
        return;
    }

    transactionHistory.forEach((item, index) => {
        // Cek jika status masih Menunggu
        const isMenunggu = item.badge === "Menunggu";
        
        // Format 6 Kolom Informasi untuk Tampilan Kartu Riwayat
        const col1Bank = item.bank ? `Bank ${item.bank}` : (item.merchant || "OVO Transaction");
        const col2Status = item.badge || "Selesai";
        const col3Total = "Rp " + (item.total ? parseInt(item.total).toLocaleString('id-ID') : parseInt(item.nominal || 0).toLocaleString('id-ID'));
        const col4Reff = item.reffCode || item.refCode || "-";
        const col5Tanggal = item.tanggalStr || item.time || "Hari ini";
        const col6Waktu = item.waktuStr || "00:00 WIB";

        const html = `
            <div onclick="bukaDetailRiwayat(${index})" class="history-card p-4 bg-white rounded-2xl border ${isMenunggu ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100'} shadow-sm cursor-pointer hover:bg-slate-50 transition-all">
                <div class="flex justify-between items-center mb-2">
                    <h4 class="text-xs font-bold text-slate-900">${col1Bank}</h4>
                    <span class="px-2.5 py-0.5 ${item.badgeBg || 'bg-slate-100 text-slate-600'} font-bold text-[9px] rounded-md">${col2Status}</span>
                </div>
                
                <!-- Grid 6 Kolom Informasi Detail Transaksi -->
                <div class="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[10px] text-slate-500 border-t border-slate-100 pt-2.5 mb-1">
                    <div><span class="text-slate-400 block text-[8px] uppercase tracking-wider">Total</span> <span class="font-bold text-slate-800">${col3Total}</span></div>
                    <div><span class="text-slate-400 block text-[8px] uppercase tracking-wider">Referensi</span> <span class="font-bold text-slate-800">${col4Reff}</span></div>
                    <div><span class="text-slate-400 block text-[8px] uppercase tracking-wider">Tanggal</span> <span class="font-semibold text-slate-700">${col5Tanggal}</span></div>
                    <div><span class="text-slate-400 block text-[8px] uppercase tracking-wider">Waktu</span> <span class="font-semibold text-slate-700">${col6Waktu}</span></div>
                </div>

                ${isMenunggu ? '<div class="mt-2 text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200 inline-block"><i class="fa-solid fa-lock mr-1"></i> Transaksi Menunggu - Detail Dikunci</div>' : ''}
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}
