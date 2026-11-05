/* sidebar.js — Billable options conversion sidebar controller.
 * Port of the engine's canonical conversion-sidebar script (engine
 * 5-design-ux-ui-monetization/monetization/, sidebar js), namespaced to
 * bill0d41 per the fleet divergence law (zero residual engine brand-namespace
 * fingerprints beyond the license storage key the fleet verifier owns
 * verbatim). SLUG filled: billable. CWS item id: TODO (not yet registered) —
 * unused: the upstream rate/review card was removed permanently (CWS §A, no
 * review solicitation) and its open-counter logic went with it; do not
 * re-add either.
 *
 * Two jobs, UTM-only per the file's own contract:
 *   1. Set the Get Pro CTA href at RUNTIME by string concat, so the literal
 *      "utm_content=<surface>" never ships in any bundle (BoxGrow rule).
 *      Zero network by law — the URL is only ever opened by a user click on
 *      that anchor (target=_blank rel="noreferrer noopener").
 *   2. Hide the Pro card when the stored license already reads pro (first
 *      paint cover; options.ts renderTier stays the authority on every
 *      storage.onChanged refresh).
 *
 * Deliberately NO chrome.runtime.sendMessage funnel ping: this extension
 * passes zero messages in any context by design (TECHNICAL-BRIEF §4). */
(function () {
  'use strict';

  var CHECKOUT_BASE =
    'https://zovo.one/pricing?utm_source=billable&utm_medium=extension&utm_campaign=upgrade';

  function checkoutUrl(surface) {
    return CHECKOUT_BASE + '&utm_content=' + surface;
  }

  function init() {
    var cta = document.querySelector('[data-bill0d41-zs-cta="pricing"]');
    if (cta) cta.setAttribute('href', checkoutUrl('sidebar'));

    try {
      chrome.storage.local.get('zovo_license', function (out) {
        var lic = out && out.zovo_license;
        if (lic && lic.tier === 'pro') {
          var card = document.querySelector('[data-bill0d41-zs="pro"]');
          if (card) card.hidden = true;
        }
      });
    } catch (e) {
      /* storage hiccup or non-extension preview — options.ts renderTier is
         the tier authority; the card simply stays visible. */
    }
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
