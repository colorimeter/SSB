document.addEventListener('DOMContentLoaded', () => {

    const eredmenyKontener1 = document.getElementById('output1');
    const eredmenyKontener2 = document.getElementById('output2');
    const eredmenyKontener3 = document.getElementById('output3');

    const adatokLekereseEsMegjelenitese = async () => {

    const msgformat = (countdown,hour,min,direction) => {
             const c=countdown.padStart(3, ' ');
             const h=hour.padStart(2, '0');
             const m=min.padStart(2, '0');
             return `${c} perc múlva (${h}:${m}) → ${direction}`;
     }

	// Gaisburg, Staatsgalerie
        const apiUrl_GB = 'https://www3.vvs.de/vvs/widget/XML_DM_REQUEST?locationServerActive=1&lsShowTrainsExplicit=1&stateless=1&language=de&SpEncId=0&anySigWhenPerfectNoOtherMatches=1&limit=10&depArr=departure&type_dm=any&anyObjFilter_dm=2&deleteAssignedStops=1&name_dm=de%3A08111%3A79&mode=direct&dmLineSelectionAll=1&useRealtime=1&outputFormat=json';
	const apiUrl_SG = 'https://www3.vvs.de/vvs/widget/XML_DM_REQUEST?locationServerActive=1&lsShowTrainsExplicit=1&stateless=1&language=de&SpEncId=0&anySigWhenPerfectNoOtherMatches=1&limit=40&depArr=departure&type_dm=any&anyObjFilter_dm=2&deleteAssignedStops=1&name_dm=de%3A08111%3A6024&mode=direct&dmLineSelectionAll=1&useRealtime=1&outputFormat=json'

        try {
            const valasz_GB = await fetch(apiUrl_GB);
            if (!valasz_GB.ok) {
                throw new Error(`HTTP error: ${valasz_GB.status}`);
            }

            const valasz_SG = await fetch(apiUrl_SG);
            if (!valasz_SG.ok) {
                throw new Error(`HTTP error: ${valasz_SG.status}`);
            }

            var resp = await valasz_GB.json();

            const varosba = resp.departureList.filter(item => item.platform === "1");
            const kifele = resp.departureList.filter(item => item.platform === "2");

            const varosba_str = varosba.map(item => msgformat(item.countdown,item.dateTime.hour,item.dateTime.minute,item.servingLine.direction));
            const kifele_str = kifele.map(item => msgformat(item.countdown,item.dateTime.hour,item.dateTime.minute,item.servingLine.direction));

            eredmenyKontener1.textContent = varosba_str.join('\n');
            eredmenyKontener2.textContent = kifele_str.join('\n');

	    resp = await valasz_SG.json();
	    //const haza = resp.departureList.filter(item => item.servingLine.symbol === "U4" );
	    const haza = resp.departureList.filter(item => item.servingLine.symbol === "U4" && item.servingLine.direction.includes("Untertürkheim"));
            const haza_str = haza.map(item => msgformat(item.countdown,item.dateTime.hour,item.dateTime.minute,item.servingLine.direction));

            eredmenyKontener3.textContent = haza_str.join('\n');


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
