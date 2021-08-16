# Show Page
This directory generates each individual game page

## Features
1. Dynamically generates show page for individual show.
2. Displays show banner and description.
3. Has links for the YouTube and Twitch playlists.
4. Has individual episode images and links.

## Input
- This page expects a query string with the parameter "name"
  - Example: show/?name=prideOfTheNightwolf
- The name parameter is used to locate the information for the individual show in [assets/jsonFiles/shows](/assets/jsonFiles/shows) 

## Components
1. NavBar
    - Description: contains files for the site's NavBar
    - Dir: [html/components/navBar](/html/components/navBar)
2. Top Category
    - Contains show banner and description
3. Episodes Section
    - Contains a section for the YouTube and Twitch playlists
    - Individual episodes w/ an image and various links

## Potential Improvements
- [ ] Expanding individual episodes to include the TLDW info instead of just links.
