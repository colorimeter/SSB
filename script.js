document.addEventListener('DOMContentLoaded', () => {

    const api_prefix = 'https://www3.vvs.de/vvs/widget/XML_DM_REQUEST?locationServerActive=1&lsShowTrainsExplicit=1&stateless=1&language=de&SpEncId=0&anySigWhenPerfectNoOtherMatches=1&depArr=departure&type_dm=any&anyObjFilter_dm=2&deleteAssignedStops=1&mode=direct&dmLineSelectionAll=1&useRealtime=1&outputFormat=json';

    const megallok = [
        {
            // Gaisburg – városba tartó irány
            url:    api_prefix + '&limit=10&name_dm=de%3A08111%3A79',
            filter: item => item.platform === "1",
            output: document.getElementById('output1'),
        },
        {
            // Gaisburg – kifelé tartó irány
            url:    api_prefix + '&limit=10&name_dm=de%3A08111%3A79',
            filter: item => item.platform === "2",
            output: document.getElementById('output2'),
        },
        {
            // Staatsgalerie – U4 Untertürkheim felé
            url:    api_prefix + '&limit=40&name_dm=de%3A08111%3A6024',
            filter: item => item.servingLine.symbol === "U4" && item.servingLine.direction.includes("Untertürkheim"),
            output: document.getElementById('output3'),
        },
        {
            // Stadtmitte (Rotebühlplatz) – U4 Untertürkheim felé
            url:    api_prefix + '&limit=20&name_dm=de%3A08111%3A6056%3A2%3A1',
            filter: item => item.servingLine.symbol === "U4" && item.servingLine.direction.includes("Untertürkheim"),
            output: document.getElementById('output4'),
        },
    ];

    const msgformat = (countdown, hour, min, direction) => {
        const c = countdown.padStart(3, ' ');
        const h = hour.padStart(2, '0');
        const m = min.padStart(2, '0');
        return `${c} perc múlva (${h}:${m}) → ${direction}`;
    };

    const mejalloLekeres = async ({ url, filter, output }) => {
        const valasz = await fetch(url);
        if (!valasz.ok) throw new Error(`HTTP error: ${valasz.status}`);

        const resp = await valasz.json();
        const sorok = resp.departureList
            .filter(filter)
            .map(item => msgformat(item.countdown, item.dateTime.hour, item.dateTime.minute, item.servingLine.direction));

        output.textContent = sorok.join('\n');
    };

    const adatokLekereseEsMegjelenitese = async () => {
        // Az összes lekérdezést egyszerre indítjuk el (Promise.allSettled),
        // hogy egy esetleges hiba ne blokkolja a többi eredményt.
        const eredmenyek = await Promise.allSettled(megallok.map(mejalloLekeres));

        eredmenyek.forEach((eredmeny, i) => {
            if (eredmeny.status === 'rejected') {
                console.error(`Hiba a(z) ${i + 1}. lekérésnél:`, eredmeny.reason);
                megallok[i].output.innerHTML = `<p style="color:red;">Hiba: ${eredmeny.reason.message}</p>`;
            }
        });
    };

    adatokLekereseEsMegjelenitese();

    document.getElementById('adatok-lekerese')
        .addEventListener('click', adatokLekereseEsMegjelenitese);
});
