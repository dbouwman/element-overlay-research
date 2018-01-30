# Element Overlay Research

## Getting Started
- clone repo
- `npm i`
- `gulp serve`

## Deploying to Surge
- `npm run deploy` if you are me, otherwise
- `surge ./dist -d some-cool-name-you-choose.surge.sh`


## Nearly-Full-Screen Overlay

The idea is to create a modal system that behaves like the [https://esri.github.io/global-nav/esri-global-nav.html](https://esri.github.io/global-nav/esri-global-nav.html) examples.

However, after digging into that project, it is not a trivial matter to create a component that mimics that behavior.

It can likely be done, but not as a side-car on an already complex story.

## How they do it...

The global nav code relies on manipulation of styles/classes/attributes on:

- `head>`
- `body>div.esri-header>button.esri-header-canvas`
- `body>div.esri-header>div.esri-header-search>div.esri-header-search-content>`

as well as having handlers on the scroll event

### Head
selector: `head`
When showing the search "modal", the head gets `data-header-is-open="true"` which applies additional styles...

```
[data-header-is-open] {
    position: fixed;
    width: 100vw;
    height: 100vh;
    width: var(--esri-vw);
    height: var(--esri-vh);
}
```

### Scroll Watching...
Note the `widthL var(--esri-vw)` which is a nice use of css variables, but we need those css vars updated on scroll... so there is a scroll handler, which constantly updates a `<style>` tag in the `<head>`...

```
<style>
  :root{
    --esri-vw:1280px;
    --esri-vh:1322px
  }
  [data-header-is-open]{
    width:1280px;
    height:1322px;
    overflow-y:scroll
  }
</style>
```
I'm not entirely clear on why the height and width are needed but it likely has something to do w/ their responsive behavior. However, the `position:fixed;` is important in that it ensures the actual page content does not scroll.

### Canvas
selector: `body>div.esri-header>button.esri-header-canvas`
This is the actual 'overlay' that covers the background content. Interestingly it's a `<button>` just styled up but it took a LONG time to figure out where it was because it's "behind" the actual overlay.


### Modal Content
selector: `body>div.esri-header>div.esri-header-search>div.esri-header-search-content>`


## The Process...

When the search button is clicked, the javascript sets a number of dom attribute properties:

- `head data-header-is-open="true"`
- `.esri-header-canvas data-state="search"`
- `.esri-header-search-content aria-expanded="true"`

The first thing sets `position:fixed` and prevents content scrolling. Then it shows the canvas, using the semi-transparent styling used for search. And finally, it shows the search content.


## Challenges for Hub

Scrolling of background content is tricky. We can't use the `position:fixed` trick as that breaks the bootstrap grid. We can get something close, by setting `overflow-y:hidden` but if we do use this, we need to scroll the page to the top before setting that or you end up with the modal off the screen.

Canvas - this took a long time to suss out, but - in theory we should be able to implement something similar.
