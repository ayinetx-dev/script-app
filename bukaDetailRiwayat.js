function bukaDetailRiwayat(index) {
    const item = transactionHistory[index];
    if (!item || item.type === 'info') return;

    // Blokir jika status transaksi masih Menunggu
    if (item.badge === "Menunggu") {
        alert("Akses diblokir: Detail transaksi dengan status 'Menunggu' tidak dapat dibuka sebelum pembayaran dikonfirmasi.");
        return;
    }

    sembunyikanSemua();
    
    if (item.type === 'paylater' || item.type === 'va_update') {
        const data = bankData[item.bank] || bankData['BCA'];
        
        const nominalAngka = parseInt(item.nominal) || 0;
        const biayaTransaksi = item.biaya !== undefined ? parseInt(item.biaya) : 2500;
        const totalPembayaran = item.total ? parseInt(item.total) : (nominalAngka + biayaTransaksi);
        
        const reffCode = item.reffCode || ("REF" + Math.floor(100000000 + Math.random() * 899999999));
        const tanggalVal = item.tanggalStr || "07 Sep 2026";
        const waktuVal = item.waktuStr || "00:00:00 WIB";

        document.getElementById('stBankLogo').src = data.logo;
        document.getElementById('stBankIconSmall').src = data.logo;
        document.getElementById('stHeader').className = `p-6 flex flex-col items-center min-h-[140px] justify-center text-white ${data.color}`;
        
        document.getElementById('stNominal').innerText = "Rp " + totalPembayaran.toLocaleString('id-ID');
        document.getElementById('stNoTujuan').innerText = currentNumber;
        document.getElementById('stVA').innerText = item.va;
        document.getElementById('stNoTransaksi').innerText = item.trxCode;
        document.getElementById('stTanggal').innerText = tanggalVal;
        document.getElementById('stWaktu').innerText = waktuVal;
        document.getElementById('stNoReff').innerText = reffCode;
        document.getElementById('stNominalDetail').innerText = "Rp " + nominalAngka.toLocaleString('id-ID');
        document.getElementById('stBiayaAdmin').innerText = "Rp " + biayaTransaksi.toLocaleString('id-ID');
        document.getElementById('stTotalDetail').innerText = "Rp " + totalPembayaran.toLocaleString('id-ID');
        
        document.getElementById('strukArea').style.display = 'block';
    } else if (item.type === 'qris') {
        const stQrisMerchant = document.getElementById('stQrisMerchant');
        const stQrisNominal = document.getElementById('stQrisNominal');
        const stQrisRef = document.getElementById('stQrisRef');
        const stQrisWaktu = document.getElementById('stQrisWaktu');
        const qrisStrukArea = document.getElementById('qrisStrukArea');

        if (stQrisMerchant) stQrisMerchant.innerText = item.merchant;
        if (stQrisNominal) stQrisNominal.innerText = "Rp " + parseInt(item.nominal).toLocaleString('id-ID');
        if (stQrisRef) stQrisRef.innerText = item.refCode;
        if (stQrisWaktu) stQrisWaktu.innerText = item.timeStr;
        
        if (qrisStrukArea) qrisStrukArea.style.display = 'block';
    }
}
