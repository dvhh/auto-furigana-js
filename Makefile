
.PHONY: clean test

kanjidic2.json : kanjidic2.xml
	xsltproc.exe kanjidic2.xslt $< > $@ 

kanjidic2.xml : kanjidic2.xml.gz
	gunzip -kfc $< > $@

kanjidic2.xml.gz :
	curl -o $@ http://www.edrdg.org/kanjidic/kanjidic2.xml.gz

clean :
	-rm kanjidic2.json kanjidic2.xml

test : 
	python -m http.server 80