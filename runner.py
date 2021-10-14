import os
import threading
count= int(input("Threads : "))
repeat= int(input("Repeat : "))
def start():
    
    
    os.system('node .\dexer.js')
    

for j in range(0,repeat):
   threads=[]
   for i in range(0,count):
   
    t=threading.Thread(target=start)
    t.start()
    threads.append(t)

   for t in threads:
    t.join()
