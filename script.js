document.addEventListener('DOMContentLoaded', () => {

    const eredmenyKontener1 = document.getElementById('output1');
    const eredmenyKontener2 = document.getElementById('output2');
    const eredmenyKontener3 = document.getElementById('output3');
	const eredmenyKontener4 = document.getElementById('output4');

    const adatokLekereseEsMegjelenitese = async () => {

    const msgformat = (countdown,hour,min,direction) => {
             const c=countdown.padStart(3, ' ');
             const h=hour.padStart(2, '0');
             const m=min.padStart(2, '0');
             return `${c} perc múlva (${h}:${m}) → ${direction}`;
     }

		const api_prefix = 'https://www3.vvs.de/vvs/widget/XML_DM_REQUEST?locationServerActive=1&lsShowTrainsExplicit=1&stateless=1&language=de&SpEncId=0&anySigWhenPerfectNoOtherMatches=1&depArr=departure&type_dm=any&anyObjFilter_dm=2&deleteAssignedStops=1&mode=direct&dmLineSelectionAll=1&useRealtime=1&outputFormat=json';
	// Gaisburg, Staatsgalerie
        //const apiUrl_GB = 'https://www3.vvs.de/vvs/widget/XML_DM_REQUEST?locationServerActive=1&lsShowTrainsExplicit=1&stateless=1&language=de&SpEncId=0&anySigWhenPerfectNoOtherMatches=1&limit=10&depArr=departure&type_dm=any&anyObjFilter_dm=2&deleteAssignedStops=1&name_dm=de%3A08111%3A79&mode=direct&dmLineSelectionAll=1&useRealtime=1&outputFormat=json';
        //const apiUrl_SG = 'https://www3.vvs.de/vvs/widget/XML_DM_REQUEST?locationServerActive=1&lsShowTrainsExplicit=1&stateless=1&language=de&SpEncId=0&anySigWhenPerfectNoOtherMatches=1&limit=40&depArr=departure&type_dm=any&anyObjFilter_dm=2&deleteAssignedStops=1&name_dm=de%3A08111%3A6024&mode=direct&dmLineSelectionAll=1&useRealtime=1&outputFormat=json'
		//const apiUrl_SM = 'https://www3.vvs.de/vvs/widget/XML_DM_REQUEST?locationServerActive=1&lsShowTrainsExplicit=1&stateless=1&language=de&SpEncId=0&anySigWhenPerfectNoOtherMatches=1&limit=20&depArr=departure&type_dm=any&anyObjFilter_dm=2&deleteAssignedStops=1&name_dm=de%3A08111%3A6056%3A2%3A1&mode=direct&dmLineSelectionAll=1&useRealtime=1&outputFormat=json'
		// Gaisburg:
		const apiUrl_GB = api_prefix + '&limit=10&name_dm=de%3A08111%3A79';
		// Staatsgalerie:
		const apiUrl_SG = api_prefix + '&limit=40&name_dm=de%3A08111%3A6024';
		// Stadtmitte (Rotebühlplatz):
		const apiUrl_SM = api_prefix + '&limit=20&name_dm=de%3A08111%3A6056%3A2%3A1';

        try {
            const valasz_GB = await fetch(apiUrl_GB);
            if (!valasz_GB.ok) {
                throw new Error(`HTTP error: ${valasz_GB.status}`);
            }

			/// Gaisburg
            var resp = await valasz_GB.json();

            const varosba = resp.departureList.filter(item => item.platform === "1");
            const kifele = resp.departureList.filter(item => item.platform === "2");

            const varosba_str = varosba.map(item => msgformat(item.countdown,item.dateTime.hour,item.dateTime.minute,item.servingLine.direction));
            const kifele_str = kifele.map(item => msgformat(item.countdown,item.dateTime.hour,item.dateTime.minute,item.servingLine.direction));

            eredmenyKontener1.textContent = varosba_str.join('\n');
            eredmenyKontener2.textContent = kifele_str.join('\n');

			
            const valasz_SG = await fetch(apiUrl_SG);
            if (!valasz_SG.ok) {
                throw new Error(`HTTP error: ${valasz_SG.status}`);
            }

			/// Staatsgalerie
	   		resp = await valasz_SG.json();
	   	    const haza = resp.departureList.filter(item => item.servingLine.symbol === "U4" && item.servingLine.direction.includes("Untertürkheim"));
            const haza_str = haza.map(item => msgformat(item.countdown,item.dateTime.hour,item.dateTime.minute,item.servingLine.direction));
            eredmenyKontener3.textContent = haza_str.join('\n');


			const valasz_SM = await fetch(apiUrl_SM);
            if (!valasz_SM.ok) {
                throw new Error(`HTTP error: ${valasz_SM.status}`);
            }

            /// Stadtmitte
			resp = await valasz_SM.json();
			const hazasm = resp.departureList.filter(item => item.servingLine.symbol === "U4" && item.servingLine.direction.includes("Untertürkheim"));
            const hazasm_str = hazasm.map(item => msgformat(item.countdown,item.dateTime.hour,item.dateTime.minute,item.servingLine.direction));
            eredmenyKontener4.textContent = hazasm_str.join('\n');

			
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
