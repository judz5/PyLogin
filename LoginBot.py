import requests
import time

url = "http://localhost:3000/auth"
 
accountList = open('accountList.txt')

working = []

for line in accountList:
    line = line.rstrip()

    account = line.split(':')
        
    payload = {
    'username': account[0],
    'password': account[1]
    }
    
    with requests.Session() as s:
        p = s.post(url, data=payload)

        if(p.text != "Incorrect Username and/or Password!"):
            working.append(payload)


print("--- Complete ---")

if(working):
    print("--- Working Accounts ---")
    for acct in working:
        print(acct) 
else:
    print("--- No Accounts Found ---")
  

    
    