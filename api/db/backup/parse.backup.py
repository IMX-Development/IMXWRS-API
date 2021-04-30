"""
Script to parse files and add to the server
filename of backup is provided by the export
list from Active Directory
"""

import random

def backup():
    filename = "users.txt"

    with open(filename, 'r', encoding = 'utf-8') as file:

        text = file.read()

        lines = text.split('\n')

        headers = lines[0].split('\t')

        name_index = headers.index('Name')

        email_index = headers.index('E-Mail Address')

        users = []

        #Skip first and las entry
        for entry in lines[1:-1]:
            user = entry.split('\t')

            user = {
                'username' : user[email_index].split('@')[0], 
                'name' : user[name_index],
                'email' : user[email_index],
                'password' : str(random.randint(1000000,9999999)),
                'position' : 'employee'
            }

            users.append(user)

        print(users)

        
if __name__ == "__main__":
    backup()