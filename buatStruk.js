function buatStruk(nominal) {
    const bankOpt = document.querySelector('input[name="bank"]:checked');
    const bank = bankOpt.value;
    const bankCode = bankOpt.getAttribute('data-code');
    const data = bankData[bank];
    const vaNumber = bankCode + "" + currentNumber;
    const randomTrx = "OVO8866" + Math.floor(1000 + Math.random() * 8999);
    const randomReff = "REF" + Math.floor(100000000 + Math.random() * 899999999);
    
    // Alur: Nominal Pembayaran + Biaya Transaksi = Total Pembayaran
    const nominalAngka = parseInt(nominal) || 0;
    const biayaTransaksi = 2500;
    const totalPembayaran = nominalAngka + biayaTransaksi;

    const now = new Date();
    const opsiTanggal = { day: 'numeric', month: 'short', year: 'numeric' };
    const opsiWaktu = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    
    const tanggalStr = now.toLocaleDateString('id-ID', opsiTanggal);
    const waktuStr = now.toLocaleTimeString('id-ID', opsiWaktu).replace(/\./g, ':') + " WIB";

    document.getElementById('stBankLogo').src = data.logo;
    document.getElementById('stBankIconSmall').src = data.logo;
    document.getElementById('stHeader').className = `p-6 flex flex-col items-center min-h-[140px] justify-center text-white ${data.color}`;
    
    // Perbarui nilai ke elemen Header Atas dan Total di Rincian Bawah secara otomatis
    document.getElementById('stNominal').innerText = "Rp " + totalPembayaran.toLocaleString('id-ID');
    document.getElementById('stNoTujuan').innerText = currentNumber;
    document.getElementById('stVA').innerText = vaNumber;
    document.getElementById('stNoTransaksi').innerText = randomTrx;
    document.getElementById('stTanggal').innerText = tanggalStr;
    document.getElementById('stWaktu').innerText = waktuStr;
    document.getElementById('stNoReff').innerText = randomReff;
    document.getElementById('stNominalDetail').innerText = "Rp " + nominalAngka.toLocaleString('id-ID');
    document.getElementById('stBiayaAdmin').innerText = "Rp " + biayaTransaksi.toLocaleString('id-ID');
    document.getElementById('stTotalDetail').innerText = "Rp " + totalPembayaran.toLocaleString('id-ID');

    const btn = document.getElementById('btnGanti');
    if (btn) {
        btn.disabled = false;
        btn.innerHTML = 'Proses';
        btn.classList.remove('bg-green-50', 'text-green-600', 'border-green-200');
        btn.classList.add('bg-slate-50', 'text-slate-700', 'hover:bg-slate-100', 'border-slate-200');
    }

    transactionHistory.unshift({
        type: "paylater",
        title: `Tagihan OVO PayLater (${bank})`,
        desc: `Sebesar Rp ${totalPembayaran.toLocaleString('id-ID')} via VA`,
        time: tanggalStr,
        badge: "Menunggu",
        badgeBg: "bg-amber-50 text-amber-600",
        icon: "fa-clock",
        iconBg: "bg-amber-100 text-amber-600",
        bank: bank,
        nominal: nominalAngka,
        biaya: biayaTransaksi,
        total: totalPembayaran,
        va: vaNumber,
        trxCode: randomTrx,
        reffCode: randomReff,
        tanggalStr: tanggalStr,
        waktuStr: waktuStr
    });
    simpanDanPerbaruiRiwayat();

    sembunyikanSemua();
    document.getElementById('strukArea').style.display = 'block';
}

function bukaDetailRiwayat(index) {
    const item = transactionHistory[index];
    if (!item || item.type === 'info') return;

    sembunyikanSemua();
    
    if (item.type === 'paylater' || item.type === 'va_update') {
        const data = bankData[item.bank] || bankData['BCA'];
        
        const nominalAngka = parseInt(item.nominal) || 0;
        const biayaTransaksi = item.biaya !== undefined ? parseInt(item.biaya) : 2500;
        const totalPembayaran = item.total ? parseInt(item.total) : (nominalAngka + biayaTransaksi);
        
        const reffCode = item.reffCode || ("REF" + Math.floor(100000000 + Math.random() * 899999999));
        const tanggalVal = item.tanggalStr || "06 Sep 2026";
        const waktuVal = item.waktuStr || "12:00:00 WIB";

        document.getElementById('stBankLogo').src = data.logo;
        document.getElementById('stBankIconSmall').src = data.logo;
        document.getElementById('stHeader').className = `p-6 flex flex-col items-center min-h-[140px] justify-center text-white ${data.color}`;
        
        // Perbarui nilai total pada riwayat tersimpan
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
