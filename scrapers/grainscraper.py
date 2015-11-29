from bs4 import BeautifulSoup
import requests
import json

import mysql.connector

conn = mysql.connector.connect(
                               user='',
                               password='',
                               host='127.0.0.1',
                               port='',
                               database=''
                               )

page = requests.get('http://www.brewunited.com/yeast_database.php')
tree = BeautifulSoup(page.content, 'html.parser')

names = []

cursor = conn.cursor()

for row in tree.findAll("tr"):

    if row['class'][0] != 'headrow':

        grainData = row.findAll('td')

        name = grainData[0].string.encode('ascii', 'ignore')
        
        lab = grainData[1]
        if lab.a is None:
            lab = lab.string.encode('ascii')
        else:
            lab = lab.a.string.encode('ascii')

        beertype = grainData[2].string.encode('ascii')

        if name in names:
            continue

        if grainData[3].string is not None:
            form = grainData[3].string.encode('ascii')
        else:
            print(name)

        temp = grainData[4].string.encode('ascii', 'ignore')
        atten = grainData[5].string.encode('ascii')
        flocc = grainData[6].string
        if flocc is not None:
            flocc = flocc.encode('ascii')
        else:
            flocc = "N/A"

        # the way they formatted the notes cell contains other tags and the "string" method
        # doesn't handle those well, returning a None type object instead.
        notes = grainData[7].contents[0].string
        # Empty notes still have tags in them which aren't serializable
        # so we have to replace them with an empty string
        if notes is not None and notes != "<br><br>":
            notes = notes.encode('ascii', 'ignore')
        else:
            notes = "N/A"

        names.append(name)

        add_yeast = ("insert into yeast "
                    "(name, lab, beertype, form, temperature, attenuation, flocculation, notes) "
                    "values (%s, %s, %s, %s, %s, %s, %s, %s)")

        cursor.execute(add_yeast, (name, lab, beertype, form, temp, atten, flocc, notes))

conn.commit()
cursor.close()
conn.close()