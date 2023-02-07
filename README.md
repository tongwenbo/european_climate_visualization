# European climate

## data pre-processing
The original data are all in ./src/assets/data.js, including the additional data I added for the German cities in csv and missing in the original data.js. <br/>
For data to be adapted for the input of visualization. ./data-process.py is used. Because this work is not focused on Python, I did not make it perfect enough to be run automatically. This is a half-automated script.<br/>
The data after processing is stored respectively in the json files under ./src/assets/.<br/>
The geojson data for Germany is extracted from https://github.com/isellsoap/deutschlandGeoJSON under the path ./src/assets/germany.json

## ploting
The svelte scripts for ploting are stored unter ./src/lib/. 
# why 3 linear js scripts and 2 regression, 2 vapor svelte scripts?
I need to parse slope and offset value seperately to Layout.svelte. And different sveltes represent different graphs that cannot be plot dynamically. (It should be a better way to formulate this code, but I did not find out how. If you know a better implementation, please refer it to me, thanks a lot!)

## app interface
App and Layout under ./src/ are the interface to the local webpage. You can run it in Chrome or Edge, preferably in the newest edition.

## how to run this assignment
1. After git clone, you should be in main folder. 
2. Execute in the terminal: npm install
3. Execute in the terminal: npm run dev 
4. Ctrl click the link in the terminal, you should see the website. (please run it in 100% screen mode)
5. Ctrl + C to end the terminal

## Detailed Story:
Firstly, I would show the map of Germany with the cities located and with the temperature mean of 2021. This is somewhat a warm-up presentation to get the audience familiar to the German map, and the cities I am about to analyze. <br/>
Secondly, I show the temperature change of the cities in the past 20 years with 2 interactions. One is a checkbox to show the regression line of each plot. The other is an option-box to show the city. I also include 2 vapor charts for 2 cities. It is clear that in the past 20 years, temperature mean of each city has increased gradually, whereas there is no clear changes on the vapor pressure side.<br/>
Finally, I used a dynamic plot with interval to show the changes of yearly precipitation and yearly sunshine with regard to 1961-1990 means in the past 20 years. I highlighted the 100% line to show to audience the important part ———— whether it is increased or not. The sunshine increased and precipitation decreased slightly, which is relevant to the extreme climate these years.
