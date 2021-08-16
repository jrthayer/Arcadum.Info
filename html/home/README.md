# Hompage 
The homepage of Arcadum.info

## Components
1. NavBar
    - Description: contains files for the site's NavBar
    - Dir: [html/components/navBar](/html/components/navBar)
2. Social Media Buttons
    - Set of buttons that go to the various links related to Arcadum
    - Fully dynamic sizing, most well known buttons have no text on mobile devices
3. Schedule(Needs Improvements, works but very messy code atm)
    - Description: Takes a set of shows for a complete week and converts it into your local timezone.
    - Dir: [html/home/schedule.js](/html/home/schedule.js)
    - Expected Input:
      - Array w/ a length of 7(one for each day)
      - Each entity in array is an array with a time(UTC) in minutes and a string for the show name
    - Result:
      - Populates the global convertedTimes array found at the top of the file
      - Structure is same as input but the minutes and day should be converted to local timezone    
4. Countdown(Needs Improvements, works but very messy code atm)
    - Description: Sets a countdown till the next show.
    - Dir: [html/home/schedule.js](/html/home/schedule.js)
    - Expected Input:
      - Currently uses global variable convertedTimes array populated above. Starts at nextShow().
    - Returns:
      - Array with two elements
        - [0] = day of the week as an int(0 = monday)
        - [1] = show of that day as an int
    - Updates:
      - display value of document.getElementById('cdDisplay');
      - display value of document.getElementById('showName');      
5. Sponsor
    - Section that holds a img+link to a sponsor and a description
6. News Section
    - Section that has a set of p tags that contain news
7. Extra Links Section
    - Section that has a set of extra buttons to various resources
8. Twitter
    - Section that contains an embedded twitter feed, copied from twitter

## Potential Improvements
- [ ] Get navBar colors from the show files, currently using redundant array with duplicate information. Was done due to limitation of previous data storage.

- [ ] Seperate countdown & schedule functionality so it can be reused, currently all the functions and meaningful variables are not orgazined to be reused despite being in a function.

- [ ] Add feature to allow shows to be skipped for the week, currently the show has to be removed from the schedule to not be used by the countdown

- [ ] Adjust Social Media Buttons css, I like having immediate access to all the links but the styling is a bit lacking atm

- [ ] Add some form of user input, currently all parts of the page need to be adjusted in the actual html/js files
