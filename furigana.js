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

	document
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

	const rubyClickHandler = event => {
		//console.log(event);
		document.title = "";
		let target = event.target
		if(target.tagName == "RUBY") {
			target = target.children[1];
		}
		console.log(target);
		console.log(target.parentNode.firstChild.data);
		if(target.tagName != "RT") {
			return;
		}
		const kanji=target.parentNode.firstChild.data;
		const current = target.textContent;
		//document.title = current;
		const replacement = window.prompt(kanji,current);
		target.textContent = replacement;
	}

	const clearRubyElements = (elements, handler) => {
		for(let i = 0; i < elements.length; ++i ) {
			let element = elements[i];
			if(element.tagName == "RUBY") {
				element.removeEventListener("click", handler);
			}
		}
	};

	const addElementListener = (elements, handler) => {
		for(let i = 0; i < elements.length; ++i ) {
			let element = elements[i];
			if(element.tagName == "RUBY") {
				element.addEventListener("click", handler);
			}
		}
	};

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
					clearRubyElements(outputElement.children, rubyClickHandler);
					outputElement.innerHTML = html;
					addElementListener(outputElement.children,rubyClickHandler);
					
				}
			);
			console.log("loaded");
			return 1;
		} );

}());