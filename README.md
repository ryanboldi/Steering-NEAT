# Steering NEAT
 Using neuroevolution of augmenting topologies to train creatures to steer around obsticles, reaching a goal.
 
 ## Files:
 ### -ball.js:
 #### Class file that contains ball class.
 #### Well, what is a ball?
 ![](ball.png)
Balls have 4 inputs, 3 inputs are their sight array, being a 0 if there is nothing in their field of view at that angle, and 1 if there is.
The 4th input is a "desired vector" that shows them the angle to the goal.
 
 ### Result after 28-29 generations of training:
 ![](Steering28.gif)
