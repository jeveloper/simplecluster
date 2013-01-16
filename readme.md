# Blazing cluster app

Basic Operation:

node cluster.js 

wait for all worker to start, Redis must be running

node client.js to create jobs 

Visually http://localhost:3000 you can see jobs in a queue 


Feats
 
 - client loads up a list of sites to check out
 - each worker to process a job from the Redis Queue
 

 Plans:


V 0.2 

- use amazon SQS and workers will listen to queue
- worry-free queue
- if using SQS = major rewrite to dump redis and kue, benchmark if it makes sense


v 0.3 

- once the image of  website comes back transform it using nodejs gm , gm("img.png").monochrome()

