#!/usr/bin/env bash

SERVERJS_LOCATION="/var/www/VIP-FINAL/Code"
VIP_WEB_DOMAIN="vip-dev.cis.fiu.edu"
#note this needs to be changed depending on the server on which this is run

/var/www/certbot-auto renew | grep 'No renewals were attempted.'
if [ $? -ne 0 ]; then
    sudo cp "/etc/letsencrypt/live/${VIP_WEB_DOMAIN}/privkey.pem" "${SERVERJS_LOCATION}/"
    sudo cp "/etc/letsencrypt/live/${VIP_WEB_DOMAIN}/cert.pem" "${SERVERJS_LOCATION}/"
    sudo cp "/etc/letsencrypt/live/${VIP_WEB_DOMAIN}/chain.pem" "${SERVERJS_LOCATION}/"

    #restart the server
    kill $(pidof nodejs)
    cd ${SERVERJS_LOCATION}
    forever start "${SERVERJS_LOCATION}/server.js"
fi