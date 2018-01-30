
/**
 * Full Screen Overlay Handlers
 */

document.querySelector('#overlayBody').addEventListener('click', function () {
    showOverlay('#overlay-modal', 125);
});

document.querySelector('#closeOverlay').addEventListener('click', function () {
  hideOverlay('#overlay-modal');
});

document.querySelector('#xOverlay').addEventListener('click', function () {
  hideOverlay('#overlay-modal');
});

/**
 * Show an overlay that sits over most of the viewport
 */
function showOverlay (overlaySelector, topOffset = 0) {
  let el =  document.querySelector(overlaySelector);
  el.style.top = (topOffset - window.scrollY) + 'px';
  el.setAttribute('aria-expanded', 'true');
  document.querySelector('html').setAttribute('data-modal-visible', 'true');
}


/**
 * Hide the overlay
 */
function hideOverlay (overlaySelector) {
  let el =  document.querySelector(overlaySelector);
  el.setAttribute('aria-expanded', 'false');
  document.querySelector('html').setAttribute('data-modal-visible', 'false');
}

/**
 * Section Overlay Handlers
 */
document.querySelector('#formTakeover1').addEventListener('click', elementTakeover);
document.querySelector('#formTakeover2').addEventListener('click', elementTakeover);
document.querySelector('#formTakeover3').addEventListener('click', elementTakeover);

/**
 * Expand an element to take over the entire space of it's parent
 */
function elementTakeover (evt) {
  // get the element that was clicked
  let t = evt.target;
  // clearly this is not going to *just work* but somehow we need a ref to the section
  // we are trying to expand so we can get it's id
  let p = t.parentElement.parentElement;
  let id = p.id;
  console.log(`Expanding ${id}`);
  // we need to get the element that we want the expanding element to take over...
  // and from that get the bounding rect so we know it's height/width etc
  let rect = document.querySelector('#formRow').getBoundingClientRect();


  // now we look for all the .collapsibles -
  // scoped this to the #formRow
  var sections = document.querySelector('#formRow').querySelectorAll('.collapsible');
  // now loop over the sections...
  sections.forEach((el) => {
    // what is the state? we can debate what data attr to use here...
    var state = el.getAttribute('data-state') || 'default';
    console.log(`...Element ${el.id} state is ${state}`);
    // if the section we are working with is the element we are making big...
    if (el.id === id) {
      // if it's current state is default, we set it
      if (state === 'default') {
        console.log(`......expanding ${el.id} to takeover state`);
        el.setAttribute('data-default-height', el.scrollHeight);
        expandSection(el, rect.height);
        el.setAttribute('data-state', 'takeover');
      }
      if (state === 'takeover') {
        console.log(`......resetting ${el.id} to default state`);
        resetSection(el);
        el.setAttribute('data-state', 'default');
      }
    } else {
      if(state === 'default') {
        console.log(`......collapsing ${el.id} to hidden state`);
        el.setAttribute('data-default-height', el.scrollHeight);
        collapseSection(el);
        el.setAttribute('data-state', 'hidden');
      } else {
        console.log(`......Resettings ${el.id} to default state`);
        resetSection(el);
        el.setAttribute('data-state', 'default')
      }
    }

  })
  console.log('-------- DONE ------------');
}

/**
 * Collapse a section
 * Animate the collapse of a section to height:0
 */
function collapseSection(element) {
  // get the height of the element's inner content, regardless of its actual size
  var sectionHeight = element.scrollHeight;

  // temporarily disable all css transitions
  var elementTransition = element.style.transition;
  element.style.transition = '';

  // on the next frame (as soon as the previous style change has taken effect),
  // explicitly set the element's height to its current pixel height, so we
  // aren't transitioning out of 'auto'
  requestAnimationFrame(function() {
    element.style.height = sectionHeight + 'px';
    element.style.transition = elementTransition;

    // on the next frame (as soon as the previous style change has taken effect),
    // have the element transition to height: 0
    requestAnimationFrame(function() {
      element.style.height = 0 + 'px';
    });
  });

}

/**
 * Animate the height of a section to it's original height
 */
function resetSection (element) {
  var defaultHeight = element.getAttribute('data-default-height');
  expandSection(element, defaultHeight);
}

/**
 * Animate the expansion of a section to a specific height
 */
function expandSection(element, height = null) {
  // get the height of the element's inner content, regardless of its actual size
  var sectionHeight = height || element.scrollHeight ;
  console.log(`> expanding ${element.id} to ${height}px`);
  // have the element transition to the height of its inner content
  element.style.height = sectionHeight + 'px';
  // when the next css transition finishes (which should be the one we just triggered)
  element.addEventListener('transitionend', function(e) {
    // remove this event listener so it only gets triggered once
    element.removeEventListener('transitionend', arguments.callee);
    // remove "height" from the element's inline styles, so it can return to its initial value
    element.style.height = null;
  });
}
