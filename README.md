# OD-Search
> Find files on the Internet.

OD-Search builds search queries, to find files on the Internet. Just select a preset (eg. videos, documents, audiofiles, ...) enter a searchterm and go.

![Screenshot](https://raw.githubusercontent.com/kevgk/OD-Search/master/screenshot.png)

## Installation
Firefox:
[OD-Search on Firefox Addons](https://addons.mozilla.org/de/firefox/addon/od-search/)

## About The Project
Why OD-Search and not one of the many websites:
* No middleman / 3rd Parties like CDNs
* Not depending on someone elses server
* No analytics / ads / logging
* Convinience
* Extendable (soon)

## Getting Started
After you have installed the addon, you should see a search icon in your browser addons. Click on the search icon to open the search window.

Now all you have to do is enter your search term, select a preset and click search.

You can also copy the search query to your clipboard, if you don't want to search directly, just click on "copy query".

The default search engine is Google, but you can customize it by clicking on the search engine menu. Currently we support Google, Startpage, DuckDuckGo and SearX.

If you only want to get results for a certain timeframe, you can select it from the Timemenu. (We currently only support this feature on Google)

You can also filter urls and words from the results by entering the urls/words in the corresponding input field. Multiple Urls/Words must be separated by a comma. 

## How does it work
All this addon does is combine search parameters.

Here for we have developed a preset system that makes it easy to create new presets and extend old ones.

For example, we have a preset for video formats and a preset for searches in Google Drive, now we combine them and have a Google Drive Video preset.

We also have a preset that filters results from pages that intentionally deceive search results. Like a blacklist.

Now we can include the blacklist in our presets and improve our search results.

## Presets
Currently, presets can only be added/adjusted by the developer through updates.

But this will change soon, we are working on a preset manager that allows you to easily add new presets.

We also hope that the community will share their presets so that everyone can benefit.

## Contributing
Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact
If you have a problem, suggestions, wishes or feedback, please open a pull-request.

## Disclaimer
We do not support illegal activities. We only help to make information more easily accessible on the Internet.

## Acknowledgements
* [Lumpysoft](https://github.com/level42ca/lumpysoft)
* [opendirectory-finder](https://github.com/ewasion/opendirectory-finder)