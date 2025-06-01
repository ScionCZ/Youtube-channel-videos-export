# YouTube Channel Video List Exporter


## What is this

This JavaScript code snippet can be run directly in your browser console or as a browser bookmark on a YouTube channel's Videos page.  
It scrolls the page automatically to load all videos, collects metadata for each video, and exports the data to a CSV file ready for Excel.

---

## Features

- Automatically scrolls down the page until all videos are loaded  
- Extracts video title, link, channel name, duration, published date, and thumbnail URL  
- Adds a sequential number to each video (oldest video = 1)  
- Orders the exported CSV with newest videos on top but numbering from oldest to newest  
- Exports CSV with UTF-8 BOM for correct display of special characters in Excel  
- Configurable selectors and output filename pattern in one place for easy maintenance  

---

## Usage
1. In your browser, create a new bookmark (favorite).
2. In the URL field of the bookmark, paste the bookmarklet code.
3. Name the bookmark and save it.
4. Open the YouTube channel’s Videos tab in your browser.  
5. Click the bookmark. A floating panel will appear.
6. You can change the .csv file name if you will.
6. Hit "Start Export" button.
7. The script will scroll automatically and export a CSV file named like `ChannelName-Video-list.csv`.  

---

## Configuration

You can customize the following variables at the top of the script

- `SELECTORS` CSS selectors used to locate elements on the page  
- `FILE_SETTINGS.fileNamePattern` pattern for the output CSV filename; use `${channelName}` as placeholder  

---

## Notes

- YouTube may change their page structure, so if the script stops working, update the selectors in the `SELECTORS` object.  
- Works best in desktop browser on the channel's Videos page.

---

## License

MIT License — feel free to modify and share.
