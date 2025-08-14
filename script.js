document.addEventListener('DOMContentLoaded', () => {

    const eredmenyKontener1 = document.getElementById('output1');
    const eredmenyKontener2 = document.getElementById('output2');

    const adatokLekereseEsMegjelenitese = async () => {

    const msgformat = (countdown,hour,min,direction) => {
             const c=countdown.padStart(3, ' ');
             const h=hour.padStart(2, '0');
             const m=min.padStart(2, '0');
             return `${c} perc múlva (${h}:${m}) -> ${direction}`;
     }

        const apiUrl = 'https://www3.vvs.de/vvs/widget/XML_DM_REQUEST?locationServerActive=1&lsShowTrainsExplicit=1&stateless=1&language=de&SpEncId=0&anySigWhenPerfectNoOtherMatches=1&limit=10&depArr=departure&type_dm=any&anyObjFilter_dm=2&deleteAssignedStops=1&name_dm=de%3A08111%3A79&mode=direct&dmLineSelectionAll=1&useRealtime=1&outputFormat=json';

        try {
            const valasz = await fetch(apiUrl);
            if (!valasz.ok) {
                throw new Error(`HTTP hiba! Státusz: ${valasz.status}`);
            }

            const resp = await valasz.json();

            const varosba = resp.departureList.filter(item => item.platform === "1");
            const kifele = resp.departureList.filter(item => item.platform === "2");

            const varosba_str = varosba.map(item => msgformat(item.countdown,item.dateTime.hour,item.dateTime.minute,item.servingLine.direction));
            const kifele_str = kifele.map(item => msgformat(item.countdown,item.dateTime.hour,item.dateTime.minute,item.servingLine.direction));


            eredmenyKontener1.textContent = varosba_str.join('\n');
            eredmenyKontener2.textContent = kifele_str.join('\n');

        } catch (hiba) {
            console.error('Hiba történt a lekérés során:', hiba);
            eredmenyKontener1.innerHTML = `<p style="color: red;">Hiba: ${hiba.message}</p>`;
            eredmenyKontener2.innerHTML = ''; 
        }
    };

    // A függvényt közvetlenül meghívjuk a DOM betöltődésekor
    adatokLekereseEsMegjelenitese();

    // refresh button
    const gomb = document.getElementById('adatok-lekerese');
    gomb.addEventListener('click', adatokLekereseEsMegjelenitese);
});
