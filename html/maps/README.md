# Map Page
This directory generates each individual map page.

## Features
1. Zooming in/out using buttons or mouse wheel.
2. Moving map around the bounds of the map container.
3. Dark mode which changes the map from white colors to black.
4. Legend which is dynamically generated based on point types available. 
5. Map points that can be toggled on/off in the legend.
6. Side panel that gets populated with point information when point is clicked.

## Input
- This page expects a query string with the parameter "map".
  - Example: maps/?map=kalkatesh
- The map parameter is used to locate the information for the individual map in [assets/jsonFiles/maps](/assets/jsonFiles/maps). 

## Components
1. NavBar
    - Description: contains files for the site's NavBar.
    - Dir: [html/components/navBar](/html/components/navBar)
2. Map
    - Holds the map image and points container.
      1. Map Image: a .png of the map
      2. Points Container: a div containing all points being placed 'on' map
3. Side Panel
    - Displays point information.
4. Settings Bar
    - A set of buttons for the various features.

## Potential Improvements
- [ ] Make use of database for map data storgae, currently all map data is in one JSON file.
