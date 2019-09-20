#!/bin/bash
START=0
END=10

ArrayOfPages=()
for ((i=END; i>=START; i--));
	do
		ArrayOfPages+=$i
		if [ ! $i -eq $START ]; then
			ArrayOfPages+=','	
		fi		
		#echo ${ArrayOfPages[$i]}

		
	done

cd ~/Loli/Lolipis/Scrapper/
#for ((i=END; i>=START; i--));
	#do
		#echo "Page: $i"
		node scrapeUrls.js $ArrayOfPages
	#done

