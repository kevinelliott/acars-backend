#!/bin/sh

openssl req -x509 -newkey rsa:4096 -keyout certs/api.airframes.io-key.pem -out certs/api.airframes.io-cert.pem -days 365
