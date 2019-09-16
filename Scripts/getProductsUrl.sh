#!/bin/bash

START=0
END=10

cd /home/spoting/Loli/Scrapper
for ((i=END; i>=START; i--));
	do
		echo "Page: $i"
		node scrapeUrls.js $i
	done

