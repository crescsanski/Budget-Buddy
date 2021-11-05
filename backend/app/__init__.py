import threading 
import os
from app import tasks

# Create a separate thread to execute tasks on timer
t1 = tasks.myThread(1, "Thread-1", 1)

# Start the game logic thread:

t1.start()