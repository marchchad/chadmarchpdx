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

page = requests.get('http://www.brewunited.com/hop_database.php')
tree = BeautifulSoup(page.content, 'html.parser')

class Hop:

    def __init__(self, name, origin, type, alpha, beta, notes):
        self.name = name
        self.origin = origin
        self.type = type
        self.alpha = alpha
        self.beta = beta
        self.notes = notes

    # output data as json
    def __repr__(self):
        return json.dumps(self.__dict__)

names = []

excludes = ['american centennial', 'Amarillo(mine)', 'Norther Brewer', 'Nortdown']

cursor = conn.cursor()

for row in tree.findAll("tr"):

    if row['class'][0] != 'headrow':

        hopData = row.findAll('td')

        name = hopData[0].string.encode('ascii')
        alpha = hopData[3].string.encode('ascii')

        if name in names or name in excludes or float(alpha) == 0.0 :
            continue

        if hopData[1].string is not None:
            origin = hopData[1].string.encode('ascii')
        else:
            print(name)

        use = hopData[2].string.encode('ascii') if hopData[1].string != "" else ""
        beta = hopData[4].string.encode('ascii')

        # the way they formatted the notes cell contains other tags and the "string" method
        # doesn't handle those well, returning a None type object instead.
        notes = hopData[5].contents[0].string
        # Empty notes still have tags in them which aren't serializable
        # so we have to replace them with an empty string
        if notes is not None and notes != "<br><br/></br>":
            notes = notes.encode('ascii')
        else:
            notes = "N/A"

        hop = Hop(name, origin, use, alpha, beta, notes)

        names.append(name)

        add_hop = ("insert into hops "
                    "(name, alphaacid, betaacid, notes, origin) "
                    "values (%s, %s, %s, %s, %s)")

        cursor.execute(add_hop, (name, float(alpha), float(beta), notes, origin))

conn.commit()
cursor.close()
conn.close()