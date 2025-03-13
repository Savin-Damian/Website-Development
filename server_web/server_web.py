import socket
import os.path
from os import path
from threading import Thread
import json

# creeaza un server socket
serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# specifica ca serverul va rula pe portul 5678, accesibil de pe orice ip al serverului
serversocket.bind(('', 5678))
# serverul poate accepta conexiuni; specifica cati clienti pot astepta la coada
serversocket.listen(5)
mesaj=""

def session(clientsocket, addr):
	while True:
		# asteapta conectarea unui client la server
		# metoda `accept` este blocanta => clientsocket, care reprezinta socket-ul corespunzator clientului conectat
		#(clientsocket, address) = serversocket.accept()
		# se proceseaza cererea si se citeste prima linie de text
		cerere = ''
		linieDeStart = ''
		linieDeDate = ''
		while True:
			buf = clientsocket.recv(4096)
			if len(buf) < 1:
				break
			cerere = cerere + buf.decode()
			print('S-a citit mesajul: \n---------------------------\n' + cerere + '\n---------------------------')
			pozitie = cerere.find('\r\n')
			if (pozitie > -1 and linieDeStart == ''):
				linieDeStart = cerere[0:pozitie]
				print('S-a citit linia de start din cerere: ##### ' + linieDeStart + ' #####')
				break
			
		print('S-a terminat cititrea.')
		if linieDeStart == '':
			clientsocket.close()
			print('S-a terminat comunicarea cu clientul - nu s-a primit niciun mesaj.')
			continue
		# interpretarea sirului de caractere `linieDeStart`
		elementeLineDeStart = linieDeStart.split()
		if(elementeLineDeStart[0] == 'GET'):
			numeResursaCeruta = elementeLineDeStart[1]
			if numeResursaCeruta == '/':
				numeResursaCeruta = '/index.html'
			
			# calea este relativa la directorul de unde a fost executat scriptul
			if(str(path.exists('D:/Date hard/Facultate AC/An 3/An 3 Sem2/PW/Proiect 1/proiect-1-savinn28/continut' + numeResursaCeruta)) == 'True'):
				numeFisier = 'D:/Date hard/Facultate AC/An 3/An 3 Sem2/PW/Proiect 1/proiect-1-savinn28/continut' + numeResursaCeruta
			elif(str(path.exists('D:/Date hard/Facultate AC/An 3/An 3 Sem2/PW/Proiect 1/proiect-1-savinn28/continut/js' + numeResursaCeruta)) == 'True'):
				numeFisier = 'D:/Date hard/Facultate AC/An 3/An 3 Sem2/PW/Proiect 1/proiect-1-savinn28/continut/js' + numeResursaCeruta
			elif(str(path.exists('D:/Date hard/Facultate AC/An 3/An 3 Sem2/PW/Proiect 1/proiect-1-savinn28/continut/imagini' + numeResursaCeruta)) == 'True'):
				numeFisier = 'D:/Date hard/Facultate AC/An 3/An 3 Sem2/PW/Proiect 1/proiect-1-savinn28/continut/imagini' + numeResursaCeruta
			
			fisier = None
			try:
				# deschide fisierul pentru citire in mod binar
				fisier = open(numeFisier,'rb')
				# tip media
				numeExtensie = numeFisier[numeFisier.rfind('.')+1:]
				tipuriMedia = {
					'html': b'text/html; charset=utf-8',
					'css': b'text/css; charset=utf-8',
					'js': b'text/javascript; charset=utf-8',
					'png': b'image/png',
					'jpg': b'image/jpeg',
					'jpeg': b'image/jpeg',
					'gif': b'image/gif',
					'ico': b'image/x-icon',
					'xml': b'application/xml',
					'json': b'application/json'
				}
				tipMedia = tipuriMedia.get(numeExtensie,'text/plain')
				
				# se trimite raspunsul
				clientsocket.sendall(b'HTTP/1.1 200 OK\r\n')
				clientsocket.sendall(b'Content-Length: ' + str(os.stat(numeFisier).st_size).encode() + b'\r\n')
				clientsocket.sendall(b'Content-Type: ' + tipMedia +b'\r\n')
				clientsocket.sendall(b'Server: My PW Server\r\n')
				clientsocket.sendall(b'\r\n')
				
				# citeste din fisier si trimite la server
				buf = fisier.read(4096)
				while (buf):
					clientsocket.send(buf)
					buf = fisier.read(4096)
			except IOError:
				# daca fisierul nu exista trebuie trimis un mesaj de 404 Not Found
				msg = 'Eroare! Resursa ceruta ' + numeResursaCeruta + ' nu a putut fi gasita!'
				print(msg)
				clientsocket.sendall(b'HTTP/1.1 404 Not Found\r\n')
				clientsocket.sendall(b'Content-Length: ' + str(len(msg.encode('utf-8'))).encode() + b'\r\n')
				clientsocket.sendall(b'Content-Type: text/plain\r\n')
				clientsocket.sendall(b'Server: My PW Server\r\n')
				clientsocket.sendall(b'\r\n')
				clientsocket.sendall(msg)

			finally:
				if fisier is not None:
					fisier.close()
			clientsocket.close()
			print('S-a terminat comunicarea cu clientul.')
		else:
			numeResursaCeruta = elementeLineDeStart[1]
			if numeResursaCeruta == '/api/utilizatori':
				json_data = buf.decode()
				data = json_data.split("\r\n")
				print(data[len(data)-1])
				data2 = data[len(data)-1]
				data2 = data2.replace("\\", "")
				data2 = json.loads(data2)

				with open("D:/Date hard/Facultate AC/An 3/An 3 Sem2/PW/Proiect 1/proiect-1-savinn28/continut/resurse/utilizatori.json", "r") as jsonFile:
						fisier_json = json.load(jsonFile)

				fisier_json.append(data2)

				with open("D:/Date hard/Facultate AC/An 3/An 3 Sem2/PW/Proiect 1/proiect-1-savinn28/continut/resurse/utilizatori.json", "w") as jsonFile:
					json.dump(fisier_json, jsonFile)

				verificare = '200 OK'
				mesaj = "Hello hellooo world! -"+"inregistreaza.html"
			else:
				verificare = b'404 Not Found'
				mesaj = verificare
			clientsocket.sendall(mesaj.encode())


while True:
	print ('#########################################################################')
	print ('Serverul asculta potentiali clienti.')
	clientsocket, addr = serversocket.accept()
	thread = Thread(target = session, args = (clientsocket, addr))
	thread.start()
	thread.join()
	contor = 0 
	print ('S-a conectat un client.')
	contor = contor + 1
	print ('Nr client: ', contor)
	
clientsocket.close()