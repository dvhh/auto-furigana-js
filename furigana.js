(function(){
	"use strict";
	const copyToClipboard = str => {
 		const el = document.createElement('textarea');
		el.value = str;
		el.setAttribute('readonly', '');
		el.style.position = 'absolute';
		el.style.left = '-9999px';
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
	};
	let copyElement = document
		.getElementById("copy")
		.addEventListener('click',
			event => {
				let outputElement = document.getElementById("output");
				let data = outputElement.innerHTML;
				copyToClipboard(data);
				event.preventDefault();
				return false;
			}
		);
	fetch(new Request('kanjidic2.json'))
		.then( response => response.json() )
		.then( dictionary => { 
			let inputElement  = document.getElementById("input");
			let outputElement = document.getElementById("output");
			inputElement.addEventListener('input',
				event => {
					//console.log(event);
					let html   = "";
					let input  = event.target.value;
					let output = "";
					let outputFurigana = "";
					for ( let i = 0; i < input.length; ++i ) {
						let char  = input.charAt(i);
						let entry = dictionary[char];
						if(entry) {
							//console.log(entry);
							output += char;
							if(entry.kun) {
								outputFurigana += entry.kun[0];
							}else if(entry.on) {
								outputFurigana += entry.on[0];
							}else if(entry.nanori) {
								outputFurigana += entry.nanori[0];
							}else {
								outputFurigana += 'X'
							}
						}else{
							if( output != "" ) {
								html += "<ruby>" + output + "<rp>(</rp><rt>" + outputFurigana + "</rt><rp>)</rp></ruby>";
							}
							output = "";
							outputFurigana = "";
							html += char;
						}
					}
					if( output != "" ) {
						html += "<ruby>" + output + "<rp>(</rp><rt>" + outputFurigana + "</rt><rp>)</rp></ruby>";
					}

					outputElement.innerHTML = html;
				}
			);
			console.log("loaded");
			return 1;
		} );

}());