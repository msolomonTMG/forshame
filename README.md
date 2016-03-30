# For Shame
A website to shame those who do not complete their timesheets

## Contribute
Add photos to someone by sending a pull request

1. clone this repo
2. make a new branch
3. edit forshame/public/js/photoCollection.js
  * add a user by creating a new object in the photoCollection with the key being their jira username
  * add an array to that object and call it "photos"
  * add up to 4 image URLs per person
    * you can add more but they won't show up
    * GIF format is encouraged for proper shaming
  * example for adding skae: 
  ```
    var photoCollection = {
      "kboateng": {
        "photos": [
          "https://media.giphy.com/media/41zG0LWQlPTAQ/giphy.gif"
        ]
      },
      "cskae": {
        "photos": [
          "http://i.imgur.com/QCEebFm.png"
        ]
      }
    };
  ```
4. commit your changes
5. submit a pull request
6. SHAME YOUR FRIENDS
